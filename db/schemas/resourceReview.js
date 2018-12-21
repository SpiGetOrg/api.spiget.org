let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let resourceReviewSchema = new Schema({
    _id:Number,
    author: {
        id: Number
    },
    rating: {
        count: Number,
        average: Number
    },
    message: String,
    version: {
        type:String,
        index:true
    },
    date: Number,
    responseMessage: String,
    resource: {
        type:Number,
        index:true
    }
}, {collection: "resource_reviews"});
module.exports = {
    schema: resourceReviewSchema,
    model: mongoose.model("ResourceReview", resourceReviewSchema)
};