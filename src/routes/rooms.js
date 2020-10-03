const express = require('express');
const { RoomsController } = require('../controllers');
const { checkAuth } = require('../middlewares');

const roomsController = new RoomsController();
const routes = express.Router();

routes.get('/', checkAuth, roomsController.getAll);
routes.get('/:roomId', checkAuth, roomsController.getById);
routes.post('/create', checkAuth, roomsController.create);

module.exports = routes;