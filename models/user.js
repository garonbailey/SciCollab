var mongoose = require('mongoose'),
	Schema   = mongoose.Schema,
	bcrypt   = require('bcrypt');

var userSchema = new Schema ({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	field: { type: String, required: true },
	research: [],
	organization: { type: String, required: true},
	degree: { type: String },
	education: { type: String, required: true },
	bio: { type: String },
	projects: [{ name: String,
				 id: String
	}],
	email: { type: String, required: true, unique: true},
	password: { type: String, required: true}
}, {collection: 'users', strict: false}, {strict: false});
var User = mongoose.model('User', userSchema);
//bcrypt salting & hashing
userSchema.pre('save', function (next) {
	var user = this;
	bcrypt.genSalt(10, function (err, salt) {
		var userPass = user.password;
		bcrypt.hash(userPass, salt, function (err, hash) {
			user.password = hash;
			next();
		});
	});
});

module.exports = User;