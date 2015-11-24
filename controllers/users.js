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
				presentUser: res.locals.presentUser
			});
		}
	});
});

userRouter.post('/new', function (req, res) {
	var userInfo = req.body.user;

	var newUser = new User(userInfo);
	newUser.projects = [];
	newUser.colleagues = [];
	research = newUser.research;
	newUser.research = research[0].split(/,\W?/);
	newUser.save(function (err, userCreated) {
		if (err) {
			console.log(newUser);
			console.log(err);
			res.redirect(302, '/signup');
		} else {
			console.log(userCreated);
			res.redirect(302, '/login');
		}
	});
});

userRouter.get('/:id', requireCurrentUser, function (req, res) {
	var scientist = req.params.id;
	// var presentUser = {
	// 	id: undefined,
	// 	name: undefined
	// };
	// console.log("res.locals id: " + res.locals.presentUser._id);
	// presentUser.name = res.locals.presentUser.firstname + " " + res.locals.presentUser.lastname;
	// console.log("present user outside of mongoose query: " + presentUser);
	User.findOne({_id: scientist}, function (err, singleUser) {
		if (err) {
			console.log(err);
			res.redirect(302, '/users');
		} else {
			User.findOne({_id: res.locals.presentUser._id}, function (localErr, currentUser) {
				if (localErr) {
					console.log(localErr);
					res.redirect(302, '/users');
				} else {
					console.log("current user: " + currentUser);
					console.log("page for: " + singleUser);
					res.render('users/show', {
						presentUser: currentUser,
						singleUser: singleUser
					});
				}
			});
		}
	});
});

userRouter.get('/:id/edit', requireCurrentUser, function (req, res) {
	var userToEdit = req.params.id;
	User.findOne({_id: userToEdit}, function (err, userEdit) {
		if (err) {
			console.log(err);
			res.redirect(302, '/users');
		} else if (userEdit.password === res.locals.presentUser.password) {
			res.render('users/edit', {
				userEdit: userEdit,
				presentUser: res.locals.presentUser
			});
		} else {
			res.redirect(302, '/users');
		}
	});
});

userRouter.patch('/:id', requireCurrentUser, function (req, res) {
	var userUpdate = req.params.id;
	var updateInfo = req.body.user;
	var errorFlash = {
		message: "Error updating"
	};
	var successFlash = {
		message: "Successfully updated!"
	};
	updateInfo.research = updateInfo.research[0].split(/,\W?/);
	updateInfo.password = updateInfo.password;
	console.log("password pre-salt gen: ", updateInfo.password);
	bcrypt.genSalt(10, function (err, salt) {
		var userPass = updateInfo.password;
		bcrypt.hash(userPass, salt, function (err, hash) {
			updateInfo.password = hash;
			console.log("hash gen: ", hash);
			User.findOneAndUpdate({_id: userUpdate}, { $set: updateInfo }, function (err, updatedUser) {
				if (err) {
					console.log(err);
					console.log(errorFlash.message);
					res.redirect('/users/' + userUpdate);
				} else {
					console.log(successFlash.message);
					res.redirect(302, '/users/' + userUpdate);
				}
			});
		});
	});
});

userRouter.delete('/:id', requireCurrentUser, function (req, res) {
	var userToDelete = req.params.id;
	User.findOneAndRemove({_id: userToDelete}, function (err, doc, result) {
		if (err) {
			console.log(error);
			res.redirect(302, '/users/' + userToDelete);
		} else {
			console.log("doc: ", doc);
			console.log("result: ", result);
			res.redirect(302, '/logout');
		}
	});
});

module.exports = userRouter;