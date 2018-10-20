const express = require('express');
const HealthController = (postgres) => {
  const router = express.Router();
  router.get('/check', async (req, res) => {
    try {
      const _ = await postgres.query('SELECT NOW()');
      return res.status(200).json({
        data: 'alive',
      });
    } catch (err) {
      return res.status(503).json({
        message: 'server health check failed',
      });
    }
  });
  router.get('/ping', async (req, res) => {
    return res.status(200).json({
      data: 'pong',
    });
  });

  return router;
};

module.exports = {
  HealthController,
};
