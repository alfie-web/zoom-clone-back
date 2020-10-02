const { check } = require('express-validator/src');

module.exports = [
	check('email').isEmail(),
	check('fullname').isString(),
	check('password').isString().isLength({ min: 3 }).custom((value, { req }) => {
		if (value !== req.body.password2) {
			throw new Error('Пароли не совпадают');
		} else {
			return value;
		}
	})
];