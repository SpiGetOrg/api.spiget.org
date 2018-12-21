let mongoose = require('mongoose')
    , Schema = mongoose.Schema;
let statusSchema = new Schema({
    key: String,
    value: {}
}, {collection: "status"});
module.exports = {
    schema: statusSchema,
    model: mongoose.model("Status", statusSchema)
};