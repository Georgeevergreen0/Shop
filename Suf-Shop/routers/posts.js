const express = require('express');
const router = express.Router();
const {
  postIndex,
  postNew,
  postCreate,
  postShow,
  postEdit,
  postUpdate,
  postDestroy
} = require('../controllers/posts');

function authorize(req, res, next) {
  if (req.session.user === undefined) {
    req.flash("error", "Login first");
    res.redirect("/users/login");
  } else {
    next()
  }
}

/* ======= Get      index      /posts ======== */
router.get('/', postIndex);


/* ======= Get      new        /posts/new ======== */
router.get('/new', authorize, postNew);

/* =======   posts     create     /posts ======== */
router.post('/', authorize, postCreate);

/* =======  Get      show       /posts/:id ======== */
router.get('/:id', postShow);

/* =======  Get      edit       /posts/:id/edit ======== */
router.get('/:id/edit', authorize, postEdit);

/* ======= Put      update     /posts/:id ======== */
router.put('/:id', authorize, postUpdate);

/* =======  Delete   destroy    /posts/:id ======== */
router.delete('/:id', authorize, postDestroy);

module.exports = router;

/*
==========================================
Method   use        url
==========================================

Get      index      /posts

Get      new        /posts/new
post     create     /posts

Get      show       /posts/:id

Get      edit       /posts/:id/edit
Put      update     /posts/:id


Delete   destroy    /posts/:id

*/