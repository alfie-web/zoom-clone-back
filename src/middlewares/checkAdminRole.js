
const checkAuthorRole = (req, res, next) => {
	const user = req.user;

	if (!user || user.role !== 'admin') {
		return res.status(403).json({
			status: 'error',
			message: 'У вас недостаточно прав'
		});
	}

	next();
}

module.exports = checkAuthorRole;