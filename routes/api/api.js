var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var db = require("./db");
// 查询分类
router.get("/", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var token = req.headers.authorization.split(" ")[1];
  if (token) {
    jwt.verify(token, "123456", function (err, das) {
      if (!err) {
        console.log("1111");
        next();
      } else {
        res.json({});
      }
    });
  }
},
async function (req, res, next) {
  var data = {
    data: await db.select("classify"),
  };
  res.json(data);
})

// 查询分类对应子分类
router.post("/list/:id", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var id = req.params.id;
  var data = {
    data: await db.select("ganclassify", "fid=" + id),
  };
  res.json(data);
});
//查询分类对应内容
router.post("/contain/:id", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var id = req.params.id;
  var data = {
    data: await db.select("contain", "fid=" + id, 8),
  };
  res.json(data);
});
//查询书本
router.get("/books", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {
    data: await db.select("books"),
  };
  res.json(data);
});
// 查询全部子分类
router.get("/ganclassify", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {
    data: await db.select("ganclassify"),
  };
  res.json(data);
});
// 查询全部内容,分页
router.get("/ganclassifyall", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {};
  var page = !req.query.page ? 1 : req.query.page;
  var pagesize = req.query.pagesize;
  data.total = await db.count("contain");
  data.data = await db.select(
    "contain",
    null,
    `${(page - 1) * pagesize + "," + pagesize}`
  );
  res.json(data);
});
// 查询分类对应内容
router.get("/containall", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var id = req.query.id;
  var data = {};
  var page = !req.query.page ? 1 : req.query.page;
  var pagesize = req.query.pagesize;
  data.total = await db.count("contain", "fid=" + id);
  data.data = await db.select(
    "contain",
    "fid=" + id,
    `${(page - 1) * pagesize + "," + pagesize}`
  );
  res.json(data);
});
//查询子分类对应内容
router.get("/subclassification", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var id = req.query.id;
  var data = {};
  var page = !req.query.page ? 1 : req.query.page;
  var pagesize = req.query.pagesize;
  data.total = await db.count("contain", "gid=" + id);
  data.data = await db.select(
    "contain",
    "gid=" + id,
    `${(page - 1) * pagesize + "," + pagesize}`
  );
  res.json(data);
});
//搜索
router.get("/search", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var words = req.query.words;
  var data = {};
  data.total = await db.count("contain", `title like "%${words}%"`);
  data.data = await db.select("contain", `title like "%${words}%"`);
  res.json(data);
});
//详情页面
router.get("/page", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var pageid = req.query.pageid;
  var data = {};
  var sql = "select * from contain where id = " + pageid;
  db.query(sql, function (error, result) {
    if (!error) {
      data.data = result[0];
    }
    res.json(data);
  });
});
//收藏
router.post("/page", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var pid = req.query.pid;
  var uid = req.query.uid;
  var title = req.query.title;
  var data = {};
  data.likes = await db.select("collect", `uid=${uid} and page_id=${pid}`);
  if (data.likes != null) {
    data.like = {
      msg: "已经收藏不要在点",
    };
    res.json(data);
  } else {
    data.data = await db.inserts(
      "collect",
      `(page_id,uid,page_title)`,
      `(${pid},${uid},'${title}')`
    );
    res.json(data);
  }
});
//用户中心
router.post("/usersinfo", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var uid = req.query.uid;
  var email = req.query.email;
  var token = req.query.token;
  var name = req.query.name;
  var data = {};
  data.users = await db.select(
    "users",
    `u_id=${uid} and Email='${email}' and token=${token} and name='${name}'`
  );
  res.json(data);
});
//收藏查询
router.post("/collect", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var uid = req.query.uid;
  var data = {};
  data.data = await db.select("collect", ` uid =  ${uid}`);
  res.json(data);
});
//购物车
router.post("/toshop", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var id = req.query.pid;
  var title = req.query.title;
  var uid = req.query.uid;
  var pic = req.query.pic;
  var money = req.query.money;
  var data = {};
  data.data = await db.select(
    "shoppingcart",
    `user_id=${uid} and shop_id = ${id}`
  );
  if (data.data != null) {
    data.like = {
      msg: "已经加入不要在点",
    };
    res.json(data);
  } else {
    data.data = await db.inserts(
      "shoppingcart",
      `(user_id,shop_id,shop_title,pic,money)`,
      `(${uid},${id},'${title}','${pic}',${money})`
    );
    res.json(data);
  }
});
//购物车查询
router.post("/toshops", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var uid = req.query.uid;
  var data = {};
  data.data = await db.select("shoppingcart", `user_id=${uid}`);
  res.json(data);
});
//购物车删除
router.post("/delshops", async function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var uid = req.query.uid;
  var data = {};
  var shopid = req.query.shopid;
  data.data = await db.delete(
    "shoppingcart",
    `user_id=${uid} and id=${shopid}`
  );

  res.json(data);
});
//订单详情信息插入
router.post("/orderinfor", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {};
  var uid = req.query.uid;
  var shopid = req.query.shopid;
  var shopnum = req.query.shopnum;
  var shoptitle = req.query.shoptitle;
  var buyid = req.query.buyid;
  var sql =
    "insert into orderinfor(uid,shopid,shopnum,shoptitle,buyid) values(?,?,?,?,?)";
  var params = [uid, shopid, shopnum, shoptitle, buyid];
  db.query(sql, params, function (error, result) {
    if (!error && result.insertId > 0) {
      data.msg = {
        msg: "成功了",
      };
      res.json(data);
    }
  });
});
//提交订单
router.post("/buy", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var buymoney = req.query.money;
  var buytieme = req.query.time;
  var num = req.query.num;
  var uid = req.query.uid;
  var data = {};
  console.log(req.query);
  var sql =
    "insert into buy(u_id,buy_time,buy_number,buy_money) values(?,?,?,?)";
  var params = [uid, buytieme, num, buymoney];
  db.query(sql, params, function (error, result) {
    if (!error && result.affectedRows > 0) {
      console.log(result);
      data.msg = {
        msg: "成功了",
        id: result.insertId,
      };
    }
    res.json(data);
  });
});
//订单号信息查询
router.post("/toorderinfor", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  var data = {};
  var uid = req.query.uid;
  var sql = "select * from buy where u_id= " + uid;
  db.query(sql, function (error, result) {
    if (!error && result.length > 0) {
      data.data = {
        star: 200,
        data: result,
      };
      res.json(data);
    } else {
      data.data = {
        msg: "还没有产生订单",
      };
      res.json(data);
    }
  });
});
module.exports = router;
