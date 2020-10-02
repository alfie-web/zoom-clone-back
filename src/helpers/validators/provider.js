const { check } = require('express-validator/src');

module.exports = [
	check('email').isEmail(),
	check('phone').isLength({ min: 3 }),
	check('company').not().isEmpty(),
];