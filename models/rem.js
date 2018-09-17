var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/try_app");

var remSchema = new mongoose.Schema({
    hours: Number,
    name: String
});


module.exports = mongoose.model("Rem", remSchema);