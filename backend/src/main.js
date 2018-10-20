const fs = require('fs');
const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('./config');

const {PostgresDB} = require('./db/postgres');
const {UserRepo} = require('./models/user/postgres');
const {GrowlRepo} = require('./models/growl/postgres');
const {UserModel} = require('./models/user');
const {GrowlModel} = require('./models/growl');
const {TokenService} = require('./service/auth');
const {UserController} = require('./controllers/user');
const {GrowlController} = require('./controllers/growls');
const {AuthController} = require('./controllers/auth');
const {HealthController} = require('./controllers/health');

function start(port) {
  const postgres = PostgresDB(config.database);

  const userRepo = UserRepo(postgres);
  const growlRepo = GrowlRepo(postgres);
  userRepo.setupRepo(); // create user table if doesn't exist
  growlRepo.setupRepo(); // create growl table if it doesn't exist

  const userModel = UserModel(userRepo);
  const growlModel = GrowlModel(growlRepo);

  const tokenService = TokenService(config.auth);
  const userController = UserController(userModel, tokenService);
  const growlController = GrowlController(growlModel, tokenService);
  const authController = AuthController(userModel, tokenService);
  const healthController = HealthController(postgres);

  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  app.use(morgan('dev'));
  app.use(
    cors({
      origin: ['http://localhost:3000'],
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(bodyParser.json());

  const router = express.Router();
  router.use('/users', userController);
  router.use('/growls', growlController);
  router.use('/health', healthController);
  router.use('/auth', authController);

  app.use('/api', router);

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

start(config.port);
