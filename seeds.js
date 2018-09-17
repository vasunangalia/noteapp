var mongoose = require("mongoose");
var Note  =            require("./models/note");
var    Attachment     =    require("./models/attachment");



var data = [
    {
        title: "Note first", 
        body: "This is first note"
    },
    {
        title: "Note second", 
        body: "This is second note"
    },
    {
        title: "Note third", 
        body: "this is thisrd note"
    },
   
]

function seedDB(){
    Note.remove({},function(err){
        if(err){
            console.log(err)
        }
      
            console.log("note removed");
            
            
        data.forEach(function(seed){
            Note.create(seed, function(err, note){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a note");
        
         Attachment.create(
                        {
                            name: "Google",
                            link: "https://www.google.com/"
                        }, function(err, attachment){
                            if(err){
                                console.log(err);
                            } else {
                                note.attachments.push(attachment);
                                note.save();
                                console.log("Created new attachment");
                            }
                        });
                }
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;