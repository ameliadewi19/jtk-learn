const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const config = require('./config');  // Mengimpor konfigurasi dari file config.js

dotenv.config(); // Load environment variables from .env file

// Menentukan environment, default ke 'development' jika tidak ada
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];

// Membuat instance Sequelize menggunakan konfigurasi yang sesuai
const sequelize = new Sequelize(
  dbConfig.database,   // Database name
  dbConfig.username,   // Database username
  dbConfig.password,   // Database password
  {
    host: dbConfig.host,   // Database host (e.g., localhost or your database server)
    dialect: dbConfig.dialect || 'postgres',  // Dialect for your database (e.g., 'postgres', 'mysql', etc.)
    port: dbConfig.port || 5432,  // Database port (default PostgreSQL port is 5432)
    logging: false,  // Disable logging of SQL queries, you can enable it for debugging
  }
);

// Test the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
