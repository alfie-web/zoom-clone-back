const { RoomModel } = require('../models');

let shift = 0;		// Это сдвиг для skip, когда добавляется новая комната(ы) в бд

class RoomsController {
	// TODO: Сотрировать по полю date и time
	getAll = async (req, res) => {
		const curUserId = String(req.user._id);
		const currentPage = Number(req.query.page);
		let pageSize = Number(process.env.ROOMS_PER_PAGE) || 6;
		const query = { $or: [{ author: curUserId }, { users: curUserId }] }

		try {
			const roomsCount = await RoomModel.countDocuments(query);

			let skip = (pageSize * currentPage) + shift;	// Формула перемещения 
			let isLastPage = skip + pageSize >= roomsCount;

			const rooms = await RoomModel.find(query)
				.skip(Math.abs(skip))
				.limit(pageSize || 5)
				// .sort({ createdAt: -1})

				shift = 0;	// Получили порцию, снова обнуляем

				console.log('rooms', rooms)

				res.json({
					status: 'success',
					data: {
						items: rooms,
						isLastPage
					}
				});

		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: 'Что-то пошло не так'
			})
		}
	}


	getById = async (req, res) => {
		const roomId = req.params.roomId;

		try {
			const room = await RoomModel.findOne({ _id: roomId });

			res.json({
				status: 'success',
				data: room
			})

		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: 'Что-то пошло не так'
			})
		}
	}

	create = async (req, res) => {
		const curUserId = req.user._id;
		const postData = {
			title: req.body.title,
			description: req.body.description,
			date: req.body.date,
			time: req.body.time,
			author: curUserId,
			users: [curUserId, ...req.body.users || []]
		}

		try {
			const room = new RoomModel(postData);
			room.save();

			res.json({
				status: 'success',
				data: room
			});

		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: 'Что-то пошло не так'
			})
		}
	}
}

module.exports = RoomsController;