"use strict"
require("dotenv").config();
const createError = require('http-errors');
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoStore = require("connect-mongo")(session);
const logger = require('morgan');
const helmet = require("helmet");
const flash = require("connect-flash");
const app = express();
const indexRouter = require('./routers/users');
const postsRouter = require('./routers/posts');
const reviewsRouter = require('./routers/reviews');

//connection to database
try {
  mongoose.connect(`mongodb://${process.env.HOST}:27017/shop`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
} catch (err) {
  console.log(`mongoose encountered inital connection error${err}`);
}
const db = mongoose.connection;
db.once("open", () => {
  console.log("mongoose has successfully connected to mongodb ")
});
db.on("error", (err) => {
  console.log(`error occured in your connection: ${err}`)
});

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Other configurations
app.use(helmet());
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(methodOverride("_method"));
app.use("/public", express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(session({
  secret: "The Fear God Is The Beginning Of Wisdom",
  name: "Evergreen",
  resave: true,
  saveUninitialized: false,
  unset: "destroy",
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: Date.now() + 10000
  },
  store: new mongoStore({
    mongooseConnection: db
  })
}))
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.title = "Evergreen Store";
  next();
})

app.get('/', function (req, res, next) {
  res.render('home', {
    title: 'Shoping Application'
  })
});

app.use('/users', indexRouter);
app.use('/posts', postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  //  req.flash("error", err.message);
  // res.redirect("back");
});

module.exports = app;