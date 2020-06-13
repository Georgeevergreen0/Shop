const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;


UserSchema = new Schema({
    image: String,
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }
})


UserSchema.statics.confirm = function (username, password, callback) {
    this.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return callback(err);
        } else if (!user || user === "" || user === null) {
            var err = new Error("User not found");
            err.status = 401;
            return callback(err);
        } else {
            bcrypt.compare(password, user.password, function (err, hash) {
                if (hash) {
                    return callback(null, user)
                } else {
                    var err = new Error("Username or Password incorrect!!!");
                    err.status = 401;
                    return callback(err);
                }
            })
        }

    })
}


UserSchema.pre("save", function (next) {
    var User = this;
    if (User.isModified("password")) {
        bcrypt.hash(this.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            } else {
                User.password = hash;
                return next();
            }
        })
    } else {
        return next()
    }
})

module.exports = mongoose.model("User", UserSchema);