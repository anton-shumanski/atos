import express from 'express';
import * as _ from 'lodash';

const router = express.Router();

module.exports = function index(app, middleware) {

  router.route('/').get(...middleware.load('IndexController.getIndex'));
  router.route('/login').get(...middleware.load('IndexController.getLogin'));
  router.route('/login').post(...middleware.load('IndexController.postLogin'));
  router.route('/logout').get(...middleware.load('IndexController.getLogout'));
  router.route('/profile').get(...middleware.load('IndexController.getProfile'));

  return router;
};
