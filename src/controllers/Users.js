const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
// const { v4 } = require('uuid');

const mailer = require('../core/mailer');
const { generateAccessToken, generateRefreshToken, replaceDbRefreshToken } = require('./../helpers/authHelper');
const { UserModel, TokenModel } = require('../models');

let shift = 0;		// Это сдвиг для skip, когда добавляется новый пользователь(и) в бд

const updateTokens = (user) => {
	const { token, exp } = generateAccessToken(user);
	const refreshToken = generateRefreshToken();

	return replaceDbRefreshToken(refreshToken.id, user)
		.then(() => {
			return ({
				exp,
				accessToken: token,
				refreshToken: refreshToken.token
			})
		})
}

class UsersController {
	getMe = (req, res) => {
		// console.log(req.user);
		const id = req.user._id;

		UserModel.findById(id)
			.exec()		
 			.then((user) => {
				res.json(user)
			 })
			.catch((err) => {
				res.status(404).json({
					message: 'User not found',
					err
				})
			})
	}
	
	signin = (req, res) => {
		// console.log('LOGIN')
		const postData = {
			email: req.body.email,
			password: req.body.password
		};

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		UserModel.findOne({ email: postData.email })
			.select('+password')
			.exec()
			.then((user) => {
				if (bcrypt.compareSync(postData.password, user.password)) {
					// console.log('user', user)
					updateTokens(user)
						.then((tokens) => {
							// console.log('TOKENS', tokens)
							return res.json({
								status: 'success',
								tokens
							})
						})
	
				} else {
					res.status(403).json({
						status: 'error',
						message: 'Некорректный email или пароль'
					})
				}
			})
			.catch(() => {
				res.status(404).json({
					message: 'Некорректный email или пароль'
				})
			})	
	}

	refreshTokens = (req, res) => {
		const secret = process.env.JWT_SECRET;
		const { refreshToken } = req.body;
		let payload;
		try {
			payload = jwt.verify(refreshToken, secret);
			if (payload.type !== 'refresh') {
				res.status(400).json({
					status: 'error',
					message: 'Invalid token!'
				})
				return;
			}
		} catch(e) {
			if (e instanceof jwt.TokenExpiredError) {
				res.status(400).json({
					status: 'error',
					message: 'Token expired!'
				})
				return;
			} else if (e instanceof jwt.JsonWebTokenError) {
				res.status(400).json({
					status: 'error',
					message: 'Invalid token!'
				})
				return;
			}
		}

		TokenModel.findOne({ tokenId: payload.id})
			.exec()
			.then((token) => {
				if (token === null) {
					throw new Error('Invalid token!');
				}

				// return updateTokens(token.userId)
				return updateTokens(token.user)
			})
			.then(tokens => res.json({
				status: 'success',
				data: tokens
			}))
			.catch(err => res.status(400).json({
				status: 'error',
				message: err.message
			}))
	}

	removeToken = async (req, res) => {
		// const userId = req.params.userId;
		const userId = req.user._id;

		try {
			await TokenModel.deleteMany({ 'user._id': userId });

			res.json({
				status: 'success'
			})

		} catch (e) {
			res.status(400).json({
				status: 'error',
				message: 'Что-то пошло не так'
			})
		}
	}












	getAll = async (req, res) => {
		const currentPage = Number(req.query.page);
		let pageSize = Number(process.env.USERS_PER_PAGE);
		const search = req.query.search;

		console.log('CUR_USER', req.user)

		try {
			const usersCount = await UserModel.countDocuments({ fullname: new RegExp(search, 'i') });

			let skip = (pageSize * currentPage) + shift;	// Формула перемещения 
			let isLastPage = skip + pageSize >= usersCount;

			const users = await UserModel.find({ fullname: new RegExp(search, 'i') })
				.skip(Math.abs(skip))
				.limit(pageSize || 5)
				.sort({ createdAt: -1})
				.select('-password')

				shift = 0	// Получили порцию, снова обнуляем

				res.json({
					status: 'success',
					data: {
						items: users,
						isLastPage
					}
				});

		} catch (e) {
			res.status(400).json({
				status: 'error',
				message: 'Что-то пошло не так'
			})
		}
	}

	


	
	getById = async (req, res) => {
		const userId = req.params.id;

		try {
			const findedUser = await UserModel.findOne({ _id: userId });

			res.json({
				status: 'success',
				data: findedUser
			})

		} catch (e) {
			res.status(400).json({
				status: 'error',
				message: 'Что-то пошло не так'
			})
		}
	}








	create = async (req, res) => {
		const postData = {
			email: req.body.email,
			password: req.body.password,
			fullname: req.body.fullname,
			confirmHash: v4()
		}

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array(), status: 'error', message: 'Некорректные данные' });
		}

		try {
			const findedUser = await UserModel.findOne({ email: postData.email })
			if (findedUser) return res.status(403).json({
				status: 'error',
				message: 'Такой пользователь уже существует'
			})

			const user = new UserModel(postData);
			await user.save();

			res.json({
				status: 'success',
				data: user
			})

			let info = await mailer.sendMail({		// можно и так, но так дольше
				from: '<admin@test.com>',
				to: user.email, 
				subject: "Подтверждение регистрации в Zoom",
				html: `Для того, чтобы подтвердить почту, перейдите <a href="${process.env.CLIENT_URL}/register/verify?hash=${user.confirmHash}&user=${user._id}">по этой ссылке</a>`,
			});

			console.log(info)

		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: 'Самсинг вент ронг'
			})
		}
	}







	verify = (req, res) => {
		const hash = req.body.hash;
		const userId = req.body.user;

		console.log(hash)

		if (!hash) return res.status(404).json({
			status: 'error',
			message: 'Hash not found'
		});

		UserModel.findOne({ _id: userId, confirmHash: hash }).exec()		// .exec()   - преобразует результат в промис
 			.then(user => {
				if (!user) {
					 return res.status(400).json({
						status: 'error',
						message: 'Invalid hash'
					})
				}

				user.confirmed = true;
				user.save(err => {
					if(err) return res.json({
						status: 'error',
						message: err
					})

					res.json({
						status: 'success',
						message: 'Account has been confirmed!'
					});
				})
			 })
			.catch((err) => {
				res.status(404).json({
					message: 'User not found',
					err
				})
			})
	}





	// update = async (req, res) => {
	// 	const userId = req.params.id;
	// 	const postData = {
	// 		email: req.body.email,
	// 		password: req.body.password,
	// 		fullname: req.body.fullname,
	// 		phone: req.body.phone,
	// 		position: req.body.position,
	// 		avatar: req.body.avatar,
	// 		role: req.body.role,
	// 	}

	// 	const errors = validationResult(req);
	// 	if (!errors.isEmpty()) {
	// 		return res.status(422).json({ errors: errors.array(), status: 'error', message: 'Некорректные данные' });
	// 	}

	// 	try {
	// 		await UserModel.updateOne({ _id: userId }, postData);

	// 		res.json({
	// 			status: 'success',
	// 		})

	// 	} catch (e) {
	// 		res.status(400).json({
	// 			status: 'error',
	// 			message: 'Некорректные данные'
	// 		})
	// 	}
	// }


	// delete = async (req, res) => {
	// 	const userId = req.params.id;

	// 	try {
	// 		await TokenModel.deleteMany({ 'user._id': userId });
	// 		await UserModel.deleteOne({ _id: userId });

	// 		res.json({
	// 			status: 'success',
	// 		})

	// 	} catch (e) {
	// 		res.status(400).json({
	// 			status: 'error',
	// 			message: 'Что-то пошло не так'
	// 		})
	// 	}
	// }


	// TODO: при удалении пользователя удаляем ещё и его refresh token из БД

}

module.exports = UsersController;