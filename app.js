var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressJwt = require("express-jwt");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var api = require("./routes/api/api");
var cors = require("cors");
var app = express();
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").__express);
app.set("view engine", "html");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  expressJwt({
    credentialsRequired: false,
    secret: "123456",
  }).unless({
    path: ["/users/login", "/users/register"],
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
