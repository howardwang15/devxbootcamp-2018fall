const express = require('express');

const AuthController = (userModel, tokenService) => {
  const router = express.Router();

  const validateLoginReq = (req) => {
    console.log(req.body);
    if (!req.body.email) {
      return {
        code: 0,
        message: 'Email must be provided',
      };
    }
    if (!req.body.password) {
      return {
        code: 0,
        message: 'Password must be provided',
      };
    }
    return null;
  };

  router.post(
    '/login',
    async (req, res) => {
      const reqErr = validateLoginReq(req);
      if (reqErr) {
        return res.status(400).json(reqErr);
      }

      const [userid, validPassword] = await userModel.verifyPassword(
        req.body.email,
        req.body.password,
      );
      if (!validPassword) {
        return res
          .status(400)
          .json({code: 0, message: 'Invalid email or password'});
      }

      const [authToken, expirationTime] = tokenService.generate(userid);
      res.cookie('auth-token', authToken, {
        httpOnly: false,
        maxAge: expirationTime * 1000,
        sameSite: 'Strict',
      });
      res.cookie('auth-login-as', userid, {
        httpOnly: false,
        maxAge: expirationTime * 1000,
        sameSite: 'Strict',
      });
      res.status(204).end();
    },
  );

  return router;
};

module.exports = {
  AuthController,
};
