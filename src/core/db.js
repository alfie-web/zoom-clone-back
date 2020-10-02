const mongoose = require('mongoose');

const PORT = String(process.env.APP_PORT) || 8080;

const connectDB = (app) => {
	mongoose.connect('mongodb://localhost:27017/zoom', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)))
	// .then( () => http.listen(process.env.APP_PORT, () => console.log('Server listening on port 5555')) )
	.catch( err => console.error(`Error connecting to mongodb://localhost:27017/zoom`, err) )
}

module.exports = connectDB;