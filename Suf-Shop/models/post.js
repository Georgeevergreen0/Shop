const mongoose = require("mongoose");
const Review = require("../models/review");
const Schema = mongoose.Schema;


PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [String],
    date: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    coordinates: Array,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]

})

PostSchema.pre("remove", function (next) {
    Review.remove({
        _id: {
            $in: this.reviews
        }
    }, next)
})

module.exports = mongoose.model("Post", PostSchema);