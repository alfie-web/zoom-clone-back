const { check } = require('express-validator/src');

module.exports = [
	check('email').isEmail().withMessage('Неверный E-mail'),
	check('password').isLength({ min: 3 })
];