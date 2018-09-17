var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    attachments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Attachment"
      }
   ]
});

module.exports = mongoose.model("Note", noteSchema);