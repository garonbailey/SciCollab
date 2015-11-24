var express        = require('express'),
	app            = express();

app.use(function (req, res, next) {
	res.locals.presentUser = req.session.currentUser;
	next();
});

module.exports = app;