const express = require('express');
const router = express.Router();
const {
  getRegisterForm,
  postRegister,
  getLoginForm,
  postLogin,
  logout
} = require("../controllers/users.js");

function authorize(req, res, next) {
  if (req.session.user === undefined) {
    req.flash("error", "Login first");
    res.redirect("/users/login");
  } else {
    next()
  }
}



/*=========== Get users/Register =========  */
router.get('/register', getRegisterForm);

/*=========== Post user/Register =========  */
router.post("/register", postRegister)


/*=========== Get user/Login =========  */
router.get('/login', getLoginForm);

/*=========== Post user/Login =========  */
router.post('/login', postLogin);


/*=========== Get user/logout =========  */
router.get('/logout', logout);


/*=========== Get user/profile =========  */
router.get('/profile', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});

/*=========== put  user/profile/:user_id =========  */
router.put('/profile/:user_id', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});



/*=========== delete  user/profile/:user_id =========  */
router.delete('/profile/:user_id', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});



/*=========== Get /forget =========  */
router.get('/profile', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});

/*=========== Put /forget =========  */
router.put('/forget', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});



/*=========== Get /reset/:token =========  */
router.get('/reset/:token', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});

/*=========== Put /reset/:token =========  */
router.put('/reset/:token', function (req, res, next) {
  res.render('home', {
    title: 'SHOPPING APPLICATION'
  });
});


module.exports = router;