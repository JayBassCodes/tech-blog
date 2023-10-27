const sequelize = require("sequelize");

require("dotenv").config();

let sequelize;

// If the server contains the JAWSDB_URL environmental variable, it connects to the JawsDB database.
if (process.env.JAWSDB_URL) {
  sequelize = new sequelize(process.env.JAWSDB_URL);
} else {
    // Otherwise, it connects to the local MySQL database.
    sequelize = new sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PW,
        {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
        }
    );
    }

module.exports = sequelize;