const { check } = require('express-validator/src');

module.exports = [
	check('email').isEmail(),
	check('password').isLength({ min: 3 }),
	check('phone').isLength({ min: 3 }),
	check('fullname').isLength({ min: 3 }),
	check('position').not().isEmpty(),
	check('role').not().isEmpty(),
];