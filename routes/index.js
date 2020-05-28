var express = require("express");
var router = express.Router();
var db =require('./db')
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/aaa", async function(req, res) {
  //查询数据库
  await db
    .table("article")
    .field("title,visit")
    .limit(0, 6)
    .select()
    .then(result => {
      console.log(result);
      res.json(result);
    });

  // await db
  //   .query("select sid,sum(views) as views from article group by sid")
  //   .then(result => {
  //     res.json(result);
  //   });
});

module.exports = router;

module.exports = router;
