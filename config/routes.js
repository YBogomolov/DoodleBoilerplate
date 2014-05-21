var home = require('../controllers/home');

module.exports = function (app) {
  // HOME PAGE
  app.get('/', home.index);
};