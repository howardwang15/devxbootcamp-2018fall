const assert = require('chai').assert;
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const Auth = require('../../src/service/auth');

const sandbox = sinon.sandbox.create();

describe('service.auth', () => {
  describe('TokenService', () => {
    let clock;
    let tokenConfig;
    let tokenService;

    beforeEach(() => {
      clock = sandbox.useFakeTimers();
      tokenConfig = {
        secret: 'test unique secret key',
        expirationTime: 1,
        issuer: 'test issuer',
      };
      tokenService = Auth.TokenService(Object.assign({}, tokenConfig));
    });

    afterEach(() => {
      sandbox.restore();
    });

    describe('#generate(userid)', () => {
      it('generates a new valid token', () => {
        clock.tick(7000);

        const userid = 'test-userid';
        const [token, expirationTime] = tokenService.generate(userid);
        const payload = jwt.verify(token, tokenConfig.secret, {
          algorithm: 'HS512',
          issuer: tokenConfig.issuer,
          subject: 'auth-token',
        });

        assert.deepEqual(
          payload,
          {
            userid,
            iat: 7,
            exp: 9,
            iss: 'test issuer',
            sub: 'auth-token',
          },
          'payload is not correct',
        );
        assert.equal(expirationTime, 1, 'expiration time is not correct');
      });
    });

    describe('#verify(token)', () => {
      it('returns the payload for a valid token', () => {
        clock.tick(8000);

        const userid = 'test-userid';
        const [token, expirationTime] = tokenService.generate(userid);

        clock.tick(999);

        const [payload, err] = tokenService.verify(token);

        assert.isNull(err, 'verification error was returned');
        assert.deepEqual(
          payload,
          {
            userid,
            iat: 8,
            exp: 10,
            iss: 'test issuer',
            sub: 'auth-token',
          },
          'payload is not correct',
        );
        assert.equal(expirationTime, 1, 'expiration time is not correct');
      });

      it('errors verifying expired tokens', () => {
        clock.tick(9000);

        const userid = 'test-userid';
        const [token, expirationTime] = tokenService.generate(userid);

        assert.equal(expirationTime, 1, 'expiration time is not correct');

        clock.tick(2000);

        const [payload, err] = tokenService.verify(token);

        assert.isNull(payload, 'payload was returned');
        assert.deepEqual(
          err,
          {code: Auth.Error.Expire, message: 'Auth token is expired'},
          'error is not correct',
        );
      });

      it('errors verifying tokens with an invalid issuer', () => {
        clock.tick(10000);

        const userid = 'test-userid';
        const tempTokenService = Auth.TokenService(
          Object.assign({}, tokenConfig, {issuer: 'different test issuer'}),
        );
        const token = tempTokenService.generate(userid);

        const [payload, err] = tokenService.verify(token);

        assert.isNull(payload, 'payload was returned');
        assert.deepEqual(
          err,
          {code: Auth.Error.General, message: err.message},
          'error is not correct',
        );
      });
    });
  });
});
