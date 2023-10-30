const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

let sequelize;

// If the server contains the JAWSDB_URL environmental variable, it connects to the JawsDB database.
if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  // Otherwise, it connects to the local MySQL database.
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
  });
}

module.exports = sequelize;