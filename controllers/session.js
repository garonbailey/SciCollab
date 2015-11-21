var express       = require('express'),
	sessionRouter = express.Router(),
	bcrypt        = require('bcrypt'),
	User          = require('../models/user.js');

sessionRouter.get('/login', function (req, res) {
	var flash = {
		message: ""
	};
	res.render('users/new', {
		flash: flash
	});
});

sessionRouter.post('/session', function (req, res) {
	var userLogin = req.body.session;
	req.session.currentUser;

	User.findOne({ email: userLogin.email }, function (userErr, sessionUser) {
		if (userErr) {
			console.log(err);
			res.redirect(302, '/login');
		} else {
			bcrypt.compare(userLogin.pass, sessionUser.password, function(passErr, cryptRes) {
				if (passErr) {
					var passErrFlash = {
						message: "Error Logging in"
					};
					console.log(err);
					res.render('users/new', {
						flash: passErrFlash
					});
				} else if (cryptRes) {
					req.session.currentUser = sessionUser._id;
					res.locals.currentUser = sessionUser;
					res.redirect(302, '/projects');
				} else if (!cryptRes) {
					var invalidFlash = {
						message: "Invalid Email/Password Combination"
					};
					res.render('users/new', {
						flash: invalidFlash
					});
				}
			});
		}
	});
});

sessionRouter.get('/logout', function (req, res) {
	delete req.session.currentUser;
	presentUser = undefined;
	res.redirect(302, '/login');
});

module.exports = sessionRouter;