let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let resourceUpdateSchema = new Schema({
    _id:Number,
    title: String,
    description: String,
    date: Number,
    likes: Number,
    resource: {
        type:Number,
        index:true
    }
}, {collection: "resource_updates"});
module.exports = {
    schema:resourceUpdateSchema,
    model:mongoose.model("ResourceUpdate", resourceUpdateSchema)
};