var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "152700",
  database: "clw"
});
db.connect();
db.select = function(table, where = "", limit = "") {
  this.table = table;
  this.where = where;
  this.limit = limit;
  return new Promise((resolve, reject) => {
    var sql = `select * from ${this.table}`;
    if (this.where) {
      sql += " where " + this.where;
    }
    if (this.limit) {
      sql += " limit " + this.limit;
    }
    db.query(sql, function(error, result) {
      if (!error && result.length > 0) {
        resolve(result);
      } else if (!error && result[0] == null) {
        resolve(null);
        console.log(result);
        console.log(error);
        console.log(sql);
      }
    });
  });
};
db.count = function(table, where = "", limit = "") {
  this.table = table;
  this.where = where;
  this.limit = limit;
  return new Promise((resolve, reject) => {
    var sql = `select count(*) as total from ${this.table}`;
    if (this.where) {
      sql += " where " + this.where;
    }
    if (this.limit) {
      sql += " limit " + this.limit;
    }
    db.query(sql, function(error, result) {
      console.log(sql);
      console.log(error);
      if (!error && result.length > 0) {
        resolve(result[0].total);
      } else {
        reject(total[0].total);
      }
    });
  });
};
db.delete = function(table, where = "") {
  this.table = table;
  this.where = where;
  return new Promise((resolve, reject) => {
    var sql = `delete from ${this.table}`;
    if (this.where) {
      sql += " where " + this.where;
    }
    db.query(sql, function(error, result) {
      console.log(sql);
      console.log(error);
      console.log(result);
      if (!error) {
        resolve({
          msg: "删除成功"
        });
      }
    });
  });
};
db.inserts = function(table, fieldname = "", values = "") {
  this.table = table;
  this.values = values;
  this.fieldname = fieldname;
  return new Promise((resolve, reject) => {
    var sql = `insert into ${this.table}`;
    if (this.fieldname) {
      sql += this.fieldname;
    }
    if (this.values) {
      sql += " values" + this.values;
    }
    db.query(sql, function(error, result) {
      console.log(error);
      console.log(result);
      if (!error && result.insertId > 0) {
        resolve(result);
      }
    });
  });
};
module.exports = db;
