const dotenv = require('dotenv');
dotenv.config();


const config = {
port: Number(process.env.PORT || 4000),
mongodbUri: process.env.MONGODB_URI,
corsOrigin: process.env.CORS_ORIGIN || '*',
basicAuthUser: process.env.BASIC_AUTH_USER || 'admin',
basicAuthPass: process.env.BASIC_AUTH_PASS || 'admin123',
};
module.exports = config;