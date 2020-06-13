const express = require('express');
const router = express.Router({
  mergeParams: true
});
const {
  reviewCreate,
  reviewUpdate,
  reviewDestroy
} = require("../controllers/reviews");

function authorize(req, res, next) {
  if (req.session.user === undefined) {
    req.flash("error", "Login first");
    res.redirect("/users/login");
  } else {
    next()
  }
}


/* =======   reviews     create     /posts/:id/reviews ======== */
router.post('/', authorize, reviewCreate);


/* ======= Put      update     /posts/:id/reviews/:reviews_id ======== */
router.put('/:reviews_id', authorize, reviewUpdate);

/* =======  Delete   destroy    /posts/:id/reviews/:reviews_id ======== */
router.delete('/:reviews_id', authorize, reviewDestroy);

module.exports = router;

/*
==========================================
Method   use        url
==========================================

Get      index      /reviews

Get      new        /reviews/new
post     create     /reviews

Get      show       /reviews/:id

Get      edit       /reviews/:id/edit
Put      update     /reviews/:id


Delete   destroy    /reviews/:id

*/