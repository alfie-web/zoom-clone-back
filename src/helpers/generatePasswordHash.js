const bcrypt = require('bcrypt');

module.exports = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hashedPassword) => {
			if (err) return reject(err);

			resolve(hashedPassword);
		})
	})
}