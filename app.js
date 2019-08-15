'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const express_1 = tslib_1.__importDefault(require('express'));
const mongoose_1 = tslib_1.__importDefault(require('mongoose'));
const compression_1 = tslib_1.__importDefault(require('compression'));
const morgan_1 = tslib_1.__importDefault(require('morgan'));
const cors_1 = tslib_1.__importDefault(require('cors'));
class App {
  constructor(controllers) {
    this.app = express_1.default();
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }
  listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
  async connectToTheDatabase() {
    try {
      const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
      await mongoose_1.default.connect(
        `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
        { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
      );
      console.log(`MongoDB is connected`);
    } catch (err) {
      console.error(err.message);
    }
  }
  initializeControllers(controllers) {
    controllers.forEach(controller => {
      this.app.use('/api/', controller.router);
    });
  }
  initializeMiddlewares() {
    this.app.use(express_1.default.json());
    this.app.use(compression_1.default());
    this.app.use(cors_1.default());
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan_1.default('dev'));
    }
  }
}
exports.default = App;
