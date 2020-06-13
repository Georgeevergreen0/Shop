const mongoose = require("mongoose");
const Schema = mongoose.Schema;

ReviewSchema = new Schema({
    review: String,
    rating: {
        type: Number,
        default: 0
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },


})

module.exports = mongoose.model("Review", ReviewSchema);