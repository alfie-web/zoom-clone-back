const { model, Schema } = require('mongoose');
// const { v4 } = require('uuid');
const generatePasswordHash = require('../helpers/generatePasswordHash');

const schema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	confirmed: {
		type: Boolean,
		default: false
	},
	confirmHash: {
		type: String,
		required: true,
		select: false
	},
	fullname: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
	}
}, {
	timestamps: true
});

schema.pre('save', function(next) {
	const user = this;

	if (!user.isModified('password')) return next();

	generatePasswordHash(user.password)
		.then(hashedPassword => {
			user.password = hashedPassword;
			// user.confirmHash = v4();

			next();
		})
		.catch(err => {
			next(err);
		});
})

module.exports = model('User', schema);