var mongoose = require("mongoose");
// var Note  =            require("./models/note");


var remSchema = new mongoose.Schema({
    time: Number,
    hours: Number
});

var Rem = mongoose.model("Rem", remSchema);
    // this give current time in milliseconds
    var d = new Date();
    var t= d.getTime();
    
var abc = new Rem ({
    time : t,
    hours: (10*60*60*100)
});

abc.save(function(err,rem){
    if(err)
    {
        console.log("something went wrong");
    }
    else
    {
        console.log("we just saved");
        console.log(rem);
    }
});


// module.exports = remtime;