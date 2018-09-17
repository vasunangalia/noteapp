var mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost/try_app");

var notifSchema = new mongoose.Schema({
    name: String
});


module.exports = mongoose.model("Notif", notifSchema);