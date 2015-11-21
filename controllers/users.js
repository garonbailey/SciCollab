var express            = require('express'),
	userRouter         = express.Router(),
	bcrypt             = require('bcrypt'),
	User               = require('../models/user.js'),
	requireCurrentUser = require('./middleware.js');

userRouter.get('/', requireCurrentUser, function (req, res) {
	User.find({}, function (err, allUsers) {
		if (err) {
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			res.render('users/index', {
				users: allUsers,
				presentUser: presentUser
			});
		}
	});
});

userRouter.post('/new', function (req, res) {
	var userInfo = req.body.user;

	var newUser = new User(userInfo);
	newUser.projects = [];
	newUser.save(function (err, userCreated) {
		if (err) {
			console.log(newUser);
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			console.log(userCreated);
			res.redirect(302, '/');
		}
	});
});

userRouter.get('/:id', requireCurrentUser, function (req, res) {
	var scientist = req.params.id;
	User.findOne({_id: scientist}, function (err, singleUser) {
		if (err) {
			console.log(err);
			res.redirect(302, '/users');
		} else {
			res.render('users/show', {
				singleUser: singleUser,
				presentUser: presentUser
			});
		}
	});
});

userRouter.get('/:id/edit', requireCurrentUser, function (req, res) {
	// edit individual user form rendered
});

userRouter.patch('/:id', requireCurrentUser, function (req, res) {
	// individual user update action, redirect back to '/:id' that brought you there
});

userRouter.delete('/:id', requireCurrentUser, function (req, res) {
	// delete individual user from DB, redirect to users' or projects' index
})

module.exports = userRouter;