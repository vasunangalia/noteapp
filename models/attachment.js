var mongoose = require("mongoose");

var attachmentSchema = new mongoose.Schema({
    name: String,
    link: String
});

module.exports = mongoose.model("Attachment", attachmentSchema);