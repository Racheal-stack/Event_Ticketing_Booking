const {Sequelize} = require('sequelize');
const config = require('../../config/config.json');
const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(config[env])

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {connectDB, sequelize};