const { model, Schema } = require('mongoose');

const schema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
	},
	date: {
		type: String,
	},
	time: {
		type: String,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	users:  [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {
	timestamps: true
});

module.exports = model('Room', schema);