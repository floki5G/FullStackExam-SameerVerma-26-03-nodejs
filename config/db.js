// const { Sequelize } = require('sequelize');
// const mongoose = require('mongoose');
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
// SQL connection// Check if .env variables are loaded (for debugging)
console.log('SQL_HOST:', process.env.SQL_HOST); // Debugging
console.log('SQL_DATABASE:', process.env.SQL_DATABASE);
console.log('SQL_USER:', process.env.SQL_USER);
console.log('SQL_PASSWORD:', process.env.SQL_PASSWORD);
const sequelize = new Sequelize(
  process.env.SQL_DATABASE,
  process.env.SQL_USER,
  process.env.SQL_PASSWORD,
  {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true, // ✅ Enforce SSL
        rejectUnauthorized: false // ✅ Allow self-signed certs
      },
      connectTimeout: 60000
    }
  }
);

const connectSQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ SQL models synchronized');
    }
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:', error);
    process.exit(1);
  }
};

// MongoDB connection
const connectMongo = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...' ,process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Unable to connect to MongoDB:', error);
    process.exit(1);
  }
};

export { connectSQL, connectMongo , sequelize};