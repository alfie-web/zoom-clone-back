const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
	if (req.path === '/users/login') return next();

	const token = req.headers.token;

	if (!token) {
		res.status(401).json({
			status: 'error',
			message: 'Token doesn\'t exist!'
		})
	}

	try {
		const payload = jwt.verify(token, secret);
		console.log('PAYLOAD_VERIFY_TOKEN', payload)
		if (payload.type !== 'access') {
			return res.status(401).json({
				status: 'error',
				message: 'Invalid token!' 
			})
		}

		req.user = payload.user;
		next();

	} catch(e) {
		console.log('E', e)
		if (e instanceof jwt.TokenExpiredError) {
			res.status(401).json({
				status: 'error',
				message: 'Token expired!'
			})
		}
		if (e instanceof jwt.JsonWebTokenError) {
			res.status(401).json({
				status: 'error',
				message: 'Invalid token!'
			})
		}
	}

	// next();
}