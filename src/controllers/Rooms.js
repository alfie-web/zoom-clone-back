
const { RoomModel } = require('../models');

class RoomsController {
	getAll = async (req, res) => {
		const curUserId = String(req.user._id);

		try {
			const rooms = await RoomModel.find({ $or: [{ author: curUserId }, { users: curUserId }] });

			res.json({
				status: 'success',
				data: {
					items: rooms,
					isLastPage: true
				}
			});

		} catch (e) {
			res.status(500).json({
				status: 'error',
				message: 'Что-то пошло не так'
			});
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
			author: curUserId,
			users: [curUserId, ...req.body.users] || [curUserId]
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