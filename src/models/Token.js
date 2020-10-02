const { model, Schema } = require('mongoose');

const schema = new Schema({
	tokenId: String,
	// userId: String
	// user: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: 'User',
	// 	// select: '-password'
	// }
	user: {
		_id: String,
		role: String
	}
})


module.exports = model('Token', schema);