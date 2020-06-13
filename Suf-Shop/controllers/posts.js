const Post = require("../models/post");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// multer configurations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000 * 1000
    },
    fileFilter: function fileFilter(req, file, cb) {
        if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
            cb(null, false);
        } else {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cb(null, true)
            } else {
                cb(null, false)
            }
        }
    },
}).array("images", 4);


// *** router controllers ****
module.exports = {

    postIndex: function (req, res, next) {
        Post.find({}, function (err, posts) {
            if (err || !posts || posts === "" || posts === null) {
                return res.render("home")
            }
            res.render("posts/index", {
                posts: posts,
                title: "All post"
            });
        })
    },



    postNew: function (req, res, next) {
        res.render("posts/new", {
            title: "new post"
        });
    },



    postCreate: [function (req, res, next) {
            upload(req, res, function (err) {
                if (err || !req.body.title || !req.body.price || !req.body.description || !req.body.location) {
                    const err = new Error("Failed to upload (note max-size per file 2mb, max-upload 4 files, accept images only and all field is required)");
                    err.status = 400;
                    return next(err);

                } else {
                    return next();
                }
            })
        },
        function (req, res, next) {
            const images = [];
            for (let file of req.files) {
                images.push(file.filename)
            };
            var posts = {
                title: req.body.title,
                images: images,
                price: req.body.price,
                description: req.body.description,
                location: req.body.location,
                author: req.session.user
            }
            Post.create(posts, function (err, post) {
                if (err) {
                    var Err = new Error("Post was not Created");
                    return next(Err)
                }
                req.flash("success", "Post created successfully!!!");
                res.redirect(`/posts/${post._id}`);
            })

        }
    ],


    postShow: function (req, res, next) {
        var postId = req.params.id;
        Post.findById(postId).populate({
            path: "reviews",
            options: {
                sort: {
                    "_id": -1
                }
            },
            populate: {
                path: "author",
            }
        }).exec(function (err, post) {
            if (err || !post || post === "" || post === null) {
                let err = new Error("Post not Found");
                return next(err);
            } else {
                res.render("posts/show", {
                    post: post,
                    title: "Your Post",
                    user: req.session.user
                })
            }
        })
    },



    postEdit: function (req, res, next) {
        var postId = req.params.id;
        Post.findById(postId, function (err, post) {
            if (err || !post || post === null) {
                return next(new Error("Post not Found"));
            }
            if (post.author.toString() !== req.session.user) {
                return next(new Error("You don't have access permission"));
            }
            res.render("posts/edit", {
                post: post,
                title: "Edit Post"
            })
        })

    },



    postUpdate: [function (req, res, next) {
            upload(req, res, function (err) {
                if (err || !req.body.title || !req.body.price || !req.body.description || !req.body.location) {
                    const err = new Error("Failed to upload (note max-size per file 2mb, max-upload 4 files, accept images only and all field is required)");
                    err.status = 400;
                    next(err)
                } else {
                    next()
                }
            })
        },
        function (req, res, next) {
            Post.findById(req.params.id, function (err, post) {
                if (err) {
                    return next(err)
                }

                if (post.author.toString() !== req.session.user) {
                    return next(new Error("You don't have access permission"))
                }

                function update() {
                    if (req.files) {
                        for (let file of req.files) {
                            post.images.push(file.filename)
                        };
                    }
                    post.title = req.body.title;
                    post.price = req.body.price;
                    post.description = req.body.description;
                    post.location = req.body.location;
                    post.save();
                    req.flash("success", "Post updated successfully!!!")
                    return res.redirect(`/posts/${post._id}`);

                }


                if (req.body.deleteImage && req.body.deleteImage.length) {
                    let deleteImage = req.body.deleteImage;
                    let count = 0;
                    deleteImage.forEach(function (value, index, array) {
                        fs.unlink(path.join(process.cwd(), "uploads", value), function (err) {
                            if (err) {
                                return next(new Error("failed to update post"))
                            } else {
                                for (let databaseImage of post.images) {
                                    if (databaseImage === value) {
                                        let index = post.images.indexOf(databaseImage);
                                        post.images.splice(index, 1);
                                    }
                                }
                                count++
                                if (count === array.length) {
                                    update();
                                }
                            }
                        })
                    })
                } else {
                    update();
                }
            })
        }

    ],



    postDestroy: function (req, res, next) {
        Post.findById(req.params.id, function (err, post) {
            if (err || !post || post === null || post === "") {
                return next(new Error("failed to remove post"));
            }
            if (post.author.toString() !== req.session.user) {
                return next(new Error("You don't have access permission"))
            }
            let count = 0;
            for (let image of post.images) {
                fs.unlink(path.join(process.cwd(), "uploads", image), async function (err) {
                    if (err) {
                        return next(new Error("unable to complete deletion of post"))

                    }
                    count++
                    if (count === post.images.length) {
                        await post.remove()
                        req.flash("success", "post deleted Successfully!!!")
                        res.redirect("/posts");
                    }
                })
            }


        });
    },

}