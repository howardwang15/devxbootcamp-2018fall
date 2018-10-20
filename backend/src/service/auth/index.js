const jwt = require('jsonwebtoken');

const Error = {
  General: 0,
  Expire: 1,
};

const TokenService = (config) => {
  const jwtOptions = {
    algorithm: 'HS512',
    issuer: config.issuer,
    subject: 'auth-token',
  };

  const getTokenTimes = () => [
    Math.floor(Date.now() / 1000),
    Math.floor(Date.now() / 1000) + config.expirationTime + 1,
  ];

  const generate = (userid) => {
    const [iat, exp] = getTokenTimes();
    const token = jwt.sign({userid, iat, exp}, config.secret, jwtOptions);
    return [token, config.expirationTime];
  };

  const verify = (token) => {
    try {
      const payload = jwt.verify(token, config.secret, jwtOptions);
      return [payload, null];
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return [null, {code: Error.Expire, message: 'Auth token is expired'}];
      }
      return [null, {code: Error.General, message: err.message}];
    }
  };

  return {
    generate,
    verify,
  };
};

module.exports = {
  Error,
  TokenService,
};
