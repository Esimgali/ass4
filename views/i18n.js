var i18n = require('i18n');


module.exports = function(req, res, next) {
    res.locals.__ = i18n.__;
    return next();
};