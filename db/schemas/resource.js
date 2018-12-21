let mongoose = require('mongoose')
    , Schema = mongoose.Schema,
    tojson = mongoose.Document.prototype.toJSON,
    toobj = mongoose.Document.prototype.toObject;
let Author = require("./author").schema;
let Version = require("./resourceVersion").schema;
let Update = require("./resourceUpdate").schema;
let Review = require("./resourceReview").schema;
let Category = require("./category").schema;
let resourceSchema = new Schema({
    _id: Number,
    name: {
        type: String,
        index: true
    },
    tag: String,
    version: Version,
    author: {
        id: Number
    },
    category: {
        id: Number
    },
    rating: {
        count: Number,
        average: Number
    },
    icon: {
        url: String,
        data: String
    },
    releaseDate: Number,
    updateDate: Number,
    downloads: Number,
    premium: Boolean,
    price: Number,
    currency: String,

    external: Boolean,
    file: {
        type: String,
        size: Number,
        sizeUnit: String,
        url: String
    },
    description: String,
    contributors: String,
    likes: Number,
    sourceCodeLink: String,
    donationLink: String,
    supportedLanguages: String,
    testedVersions: [String],
    versions: [Version],
    updates: [Update],
    reviews: [Review],
    links: {}
}, {collection: "resources"});
module.exports = {
    schema: resourceSchema,
    model: mongoose.model("Resource", resourceSchema)
};