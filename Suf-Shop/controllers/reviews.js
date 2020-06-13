const Post = require("../models/post");
const Review = require("../models/review");

module.exports = {
    reviewCreate: function (req, res, next) {
        if (!req.body.review || !req.body.rating) {
            return next(new Error("All field are required!!!"));
        }
        let review = {
            review: req.body.review,
            rating: req.body.rating,
            author: req.session.user
        }
        Post.findById(req.params.id).populate("reviews").exec(function (err, post) {
            if (err || !post || post === "" || post === null) {
                return next(new Error("Comment was not created!!!"));
            }

            let existingReview = post.reviews.filter(function (review) {
                return review.author.equals(req.session.user);
            })

            if (existingReview.length) {
                req.flash("error", "You can't make more than one review!!!");
                return res.redirect(`/posts/${post.id}`);
            }

            Review.create(review, function (err, review) {
                if (err) {
                    next(new Error("Comment was not created!!!"));
                }
                post.reviews.push(review._id);
                post.save();
                req.flash("success", "Review created successfully!!!");
                res.redirect(`/posts/${post.id}`);
            })
        })
    },

    //:reviews_id
    reviewUpdate: async function (req, res, next) {
        if (!req.body.review || !req.body.rating) {
            return next(new Error("All field are required!!!"));
        }

        Review.findById(req.params.reviews_id, function (err, review) {
            if (!review.author.equals(req.session.user)) {
                return next(new Error("You can only update post you created!!!"))
            }

            let newReview = {
                review: req.body.review,
                rating: req.body.rating
            }

            Review.findByIdAndUpdate(req.params.reviews_id, newReview, function (err, review) {
                if (err) {
                    return next(new Error("Comment was not Update!!!"));
                }
                req.flash("success", "Review was updated successfully!!!")
                res.redirect(`/posts/${req.params.id}`)
            })
        })
    },

    reviewDestroy: function (req, res, next) {
        Review.findById(req.params.reviews_id, function (err, review) {
            if (err) {
                return next(new Error("post was not found"));
            }
            if (!review.author.equals(req.session.user)) {
                return next(new Error("You can only update post you created!!!"))
            }


            Post.findById(req.params.id, function (err, post) {
                if (err) {
                    return next(new Error("Comment was not delete!!!"));
                }
                post.reviews.remove(req.params.reviews_id);
                post.save(function (err) {
                    if (err) {
                        return next(new Error("Comment was not Update!!!"));
                    }

                    Review.findByIdAndDelete(req.params.reviews_id, function (err, review) {
                        req.flash("success", "deleted successfully")
                        res.redirect(`/posts/${req.params.id}`)
                    })

                })

            })
        })
    },
}