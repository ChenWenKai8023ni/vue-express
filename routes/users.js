var express = require("express");
var jwt = require("jsonwebtoken");

var router = express.Router();
var db = require("./api/db");
//登陆
router.get("/login", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {};
  var email = req.query.email;
  var pwd = req.query.pwd;

  var sql = "select Email from users where Email=" + "'" + email + "'";

  db.query(
    "select Email from users where Email=" + "'" + email + "'",
    function (error, resultss) {
      if (!error && resultss.length > 0) {
        var sql =
          "select * from users where Email= '" +
          email +
          "' and pwd= '" +
          pwd +
          "'";
        db.query(sql, function (error, result) {
          if (!error && result.length > 0) {
            const token = jwt.sign(
              //数据  载荷
              {
                _id: result[0].u_id,
                username: result[0].name,
                email: result[0].Email,
              },
              //加密秘钥
              "123456",
              //过期时间
              {
                expiresIn: 3600 * 24 * 3,
                //or
                //expiresIn: "10 days"
              }
            );
            data.user = {
              status: 200,
              msg: "登陆成功",
              data: {
                name: result[0].name,
                email: result[0].Email,
                token: token,
                id: result[0].u_id,
              },
            };
            var sql =
              "update users set token=" +
              "'" +
              token +
              "'" +
              " where Email=" +
              "'" +
              email +
              "'";

            db.query(sql, function (error, results) {
              if (!error && results.changedRows > 0) {
                data.verify = {
                  status: 200,
                };
                res.json(data);
              }
            });
          } else {
            data.user = {
              status: 501,
              msg: "网络繁忙",
              data: error,
            };
            res.json(data);
          }
        });
      } else {
        data.user = {
          status: 500,
          msg: "用户名错误",
        };
        res.json(data);
      }
    }
  );
});
//注册
router.post("/register", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {};
  var name = req.query.name;
  var pwd = req.query.pwd;
  var email = req.query.email;
  var sqls = "select Email from users where Email=" + "'" + email + "'";
  db.query(sqls, function (error, result) {
    if (!error && result.length > 0) {
      data.user = {
        judge: 1,
        data: result[0],
      };
      res.json(data.user.judge);
    } else if (!error && result.length < 1) {
      var sql = "insert into users(name,pwd,Email) values(?,?,?)";
      var params = [name, pwd, email];
      db.query(sql, params, function (error, results) {
        if (!error) {
          data.user = {
            msg: "注册成功",
          };
          res.json(data.user.msg);
        }
      });
    }
  });
});
module.exports = router;
