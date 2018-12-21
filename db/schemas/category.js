let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let categorySchema = new Schema({
    _id:Number,
    name: {
        type:String,
        index:true
    }
}, {collection: "categories"});
module.exports = {
    schema:categorySchema,
    model:mongoose.model("Category", categorySchema)
};