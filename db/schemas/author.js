let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let authorSchema = new Schema({
    _id:Number,
    name: {
        type: String,
        index: true
    },
    icon: {
        url: String,
        data: String
    }
}, {collection: "authors"});
module.exports = {
    schema: authorSchema,
    model: mongoose.model("Author", authorSchema)
};