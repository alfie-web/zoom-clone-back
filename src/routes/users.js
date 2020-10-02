const express = require('express');

const { checkAuth, checkAdminRole } = require('../middlewares');
const { loginValidation, userValidation, registerValidation } = require('../helpers/validators');
const { UsersController } = require('../controllers');

const routes = express.Router();
const userController = new UsersController();


routes.get('/', checkAuth, userController.getAll);
routes.get('/user/:id', checkAuth, userController.getById);

routes.get('/me', checkAuth, userController.getMe);
routes.post('/login', loginValidation, userController.signin);
routes.post('/refresh-tokens', userController.refreshTokens);
routes.delete('/remove-token', checkAuth, userController.removeToken);
routes.post('/create', registerValidation, userController.create);
// routes.patch('/update/:id', checkAuth, userController.update);
// routes.delete('/delete/:id', checkAuth, userController.delete);

module.exports = routes;