var i18n = require('i18n');

i18n.configure({
  locales:['en', 'ru'],
  directory: __dirname + '/locales',
  
  defaultLocale: 'en',
  cookie: 'lang',
});


module.exports = function(req, res, next) {
    res.locals.__ = i18n.__;
    return next();
  };