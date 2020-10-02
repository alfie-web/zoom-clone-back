
const checkAdminOrEmployeeRole = (req, res, next) => {
	const user = req.user;

	console.log('userRole', user)

	// if (!user || (user.role !== 'admin' || user.role !== 'employee')) {
	if (!user && (user.role !== 'admin' || user.role !== 'employee')) {
		return res.status(403).json({
			status: 'error',
			message: 'У вас недостаточно прав'
		});
	}

	next();
}

module.exports = checkAdminOrEmployeeRole;