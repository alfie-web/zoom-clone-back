const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');

const { TokenModel } = require('../models');

const secret = process.env.JWT_SECRET;

const generateAccessToken = (user) => {
	const payload = {
		user: {
			_id: user._id,
			// role: user.role
		},
		type: process.env.JWT_ACCESS_TYPE,
	};
	const options = { expiresIn: process.env.JWT_ACCESS_MAX_AGE };

	const token = jwt.sign(payload, secret, options);
	const decoded = jwt.decode(token);

	// В exp находится время жизни токена в timestamp, только не в милисекундах, а в секундах
	// Поэтому на клиенте нужно умножать на 1000
	return {
		token,
		exp: decoded.exp	
	}
}

const generateRefreshToken = () => {
	const payload = {
		id: v4(),
		type: process.env.JWT_REFRESH_TYPE
	}
	const options = { expiresIn: process.env.JWT_REFRESH_MAX_AGE };

	return {
		id: payload.id,
		token: jwt.sign(payload, secret, options)
	}
}

const replaceDbRefreshToken = (tokenId, user) => {
	return TokenModel.findOneAndRemove({ 'user._id': user._id })
		.exec()
		.then(() => TokenModel.create({ tokenId, user }))
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
	replaceDbRefreshToken
}