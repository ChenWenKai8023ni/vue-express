var Mysql = require("node-mysql-promise");
var db = Mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "152700",
  database: "myblog"
});
module.exports = db;
