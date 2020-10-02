const { check } = require('express-validator/src');

module.exports = [
	check('title').not().isEmpty(),
];