const dotEnv = require('dotenv');

dotEnv.config();
const app = require('express')();


const connectDB = require('./core/db');
const createRoutes = require('./routes');

connectDB(app);
createRoutes(app);


