// Express and Connect middlewares:
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var csrf = require('csurf');
var errorHandler = require('errorhandler');
var favicon = require('serve-favicon');

var pkg = require('../package');
var path = require('path');
var hbs = require('express-hbs');
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

module.exports = function (app) {
  app.set('port', config.port);

  // Handlebars setup:
  app.set('views', path.join(config.root, 'views'));
  if (env === 'production') {
    app.enable('view cache');
  }
  app.engine('hbs', hbs.express3({
    partialsDir: config.root + '/views/partials',
    defaultLayout: config.root + '/views/layouts/main.hbs',
    layoutsDir: config.root + '/views/layouts'
  }));
  app.locals.layout = "main";
  app.set('view engine', 'hbs');

  // Favicon:
  app.use(favicon(path.join(config.root, '/public/favicon.ico')));

  // forms parsing:
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());

  // cookieParser should be above session
  app.use(cookieParser(pkg.name));
  app.use(session({
    secret: pkg.name
  }));

  // development only
  if ('development' == app.get('env')) {
    app.use(errorHandler());
  }

  if ('production' == env) {
    app.enable('trust proxy');
  }

  // CSRF protection!
  app.use(csrf()).use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrf_token = req.csrfToken();
    next();
  });


  // ROUTES
  require('./routes')(app); // routes should go last due to Express 4.x has app.router removed.


  app.use(express.static(path.join(config.root, 'public')));

  // custom error handler
  app.use(function (err, req, res, next) {
    if (err.message && (~err.message.indexOf('not found') || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);
    return res.status(500).render('500');
  });

  app.use(function (req, res, next) {
    res.status(404).render('404', { url: req.originalUrl })
  });
};