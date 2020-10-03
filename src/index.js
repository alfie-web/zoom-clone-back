const http = require('http');

const dotEnv = require('dotenv');

dotEnv.config();
const app = require('express')();
const server = http.createServer(app);

const connectDB = require('./core/db');
const createRoutes = require('./routes');

const io = require('./core/sockets')(server);

connectDB(server);
createRoutes(app, io);
