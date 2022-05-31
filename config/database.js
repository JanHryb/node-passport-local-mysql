const mysql = require("mysql");

const connect = () => {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "warehouse",
  });

  connection.connect((err) => {
    if (err) console.error(err);
    else console.log("successfully connected to DB");
  });

  return connection;
};

module.exports = { connect };
