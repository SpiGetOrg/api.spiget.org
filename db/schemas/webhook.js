let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let webhookSchema = new Schema({
    _id: String,
    url: String,
    secret: String,
    createdAt: Number,
    failedConnections: Number,
    failStatus: Number,
    events: {
        type: [String],
        enum: ["new-resource", "resource-update", "new-author"]
    }
}, {collection: "webhooks"});
module.exports = {
    schema: webhookSchema,
    model: mongoose.model("Webhook", webhookSchema)
};