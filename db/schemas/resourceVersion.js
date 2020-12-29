let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let resourceVersionSchema = new Schema({
    _id: Number,
    uuid: {
        type: String,
        index: true
    },
    name: {
        type: String,
        index: true
    },
    releaseDate: Number,
    resource: {
        type: Number,
        index: true
    },
    downloads: Number,
    rating: {
        count: Number,
        average: Number
    }
}, {collection: "resource_versions"});
module.exports = {
    schema: resourceVersionSchema,
    model: mongoose.model("ResourceVersion", resourceVersionSchema)
};
