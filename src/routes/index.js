const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const corsOptions = {
	// origin: '*',
	origin: process.env.CLIENT_URL,	// Настроил откуда можно делать запросы к api
	// origin: 'C:/Users/playe/Desktop/MyWebProjects/React/chat-back/index.html',
	credentials: true
	// preflightContinue: true
}

const createRoutes = (app) => {
	app.use(express.json());
	// app.use(express.urlencoded({ extended: true }));		// Эта штука нужна если мы отправляем данные из формы (файлы например)
	app.use(helmet());
	app.use(cors(corsOptions));

	app.use('/users', require('./users'));

}

module.exports = createRoutes;