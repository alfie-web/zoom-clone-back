const http = require('http');

const dotEnv = require('dotenv');

dotEnv.config();
const app = require('express')();
const server = http.createServer(app);

// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
// 	debug: true
// });

// app.use('/peerjs', peerServer);

const connectDB = require('./core/db');
const createRoutes = require('./routes');

const io = require('./core/sockets')(server);

createRoutes(app, io);
connectDB(server);
