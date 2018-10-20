const express = require('express');
const {loggedInMiddleware} = require('../middleware/auth.js');
const GrowlController = (growlModel, tokenService) => {
  const router = express.Router();

  // /growl?amount=amt&offset=offset&userid=id GET
  //
  // Requires three parameters, where amount = # of growls wanted, offset =
  // which page of growls should be returned, and if the growls should be
  // returned by user_id, or just by everyone.
  // Returns the growl object under the format:
  // {
  //    "data": {
  //      "growls": {...}
  //    }
  // }
  router.get('/', async (req, res) => {
    if (!req.query)
      return res.status(400).json({
        message: 'Missing Query Parameters',
      });
    const query = req.query;

    // TODO validate inputs
    const amount = query.amount; // must be number
    const offset = query.offset; // must be number and offset must exist with amount
    const user_id = query.user_id; // user_id

    const [growls, err] = await growlModel.getGrowls(amount, offset, user_id);

    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }
    return res.status(200).json({
      data: {growls},
    });
  });

  // /growl POST
  // Body: {
  //    text: String
  //    user_id: Int
  // }
  //
  // Creates a growl. Returns the growl id in the format
  // {
  //    "data": {
  //      "id": Int
  //    }
  // }
  router.post('/', async (req, res) => {
    // BOOTCAMP
  });

  // TODO check ownership with SQL relations
  router.delete('/:id', loggedInMiddleware(tokenService), async (req, res) => {
    const params = req.params;
    const id = parseInt(params.id, 10);
    const err = await growlModel.deleteGrowl(id, user_id);
    if (err) {
      return res.status(400).json({
        message: err.message,
      });
    }

    return res.status(204).send();
  });
  return router;
};

module.exports = {
  GrowlController,
};
