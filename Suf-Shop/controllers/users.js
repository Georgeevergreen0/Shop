const User = require("../models/user.js");

module.exports = {
    getRegisterForm: function (req, res, next) {
        res.render("users/new");
    },

    postRegister: function (req, res, next) {
        if (!req.body.name || !req.body.username || !req.body.password || !req.body.confirm_password || !req.body.email) {
            return next(new Error("All field are required!!!"))
        }

        if (req.body.password !== req.body.confirm_password) {
            return next(new Error("Password must match!!!"))
        }
        var profile = {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        }
        User.create(profile, function (err, user) {
            if (err) {
                next(new Error("Profile was not created!!!"));
            } else {
                req.flash("success", "Profile created succesfully!!!");
                res.redirect("/users/login");
            }

        })
    },

    getLoginForm: function (req, res, next) {
        res.render("users/login");
    },

    postLogin: function (req, res, next) {
        if (!req.body.username || !req.body.password) {
            return next(new Error("Missing Field!!!"))
        }
        var username = req.body.username;
        var password = req.body.password;
        User.confirm(username, password, function (err, user) {
            if (err) {
                return next(err)
            } else {
                req.session.user = user._id
                req.flash("success", "Welcome!!!");
                return res.redirect("/");
            }
        })
    },

    logout: function (req, res, next) {
        req.session.destroy(function (err) {
            if (err) {
                return next(new Error("Unable to logout"))
            }
            res.clearCookie("Evergreen", {
                path: "/",
                httpOnly: true,
                secure: false,
            });
            return res.redirect("/");
        });

    }
}