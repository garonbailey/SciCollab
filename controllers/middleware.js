var requireCurrentUser = function (req, res, next) {
	if (req.session.currentUser) {
		res.locals.presentUser = req.session.currentUser;
		next();
	} else {
		res.redirect(302, '/login');
	}
};

module.exports = requireCurrentUser;