let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let updateRequestSchema = new Schema({
    type: {
        type: String,
        enum: ["resource", "author"]
    },
    requestedId: Number,
    requested: Number,
    versions: Boolean,
    updates: Boolean,
    reviews: Boolean
}, {collection: "update_requests"});
module.exports = {
    schema: updateRequestSchema,
    model: mongoose.model("UpdateRequest", updateRequestSchema)
};
