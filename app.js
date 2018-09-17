var express =           require("express"),
    app =               express(),
    bodyParser =        require("body-parser"),
    methodOverride =    require("method-override"),
    mongoose =          require("mongoose"),
     Note  =            require("./models/note"),
    Attachment     =    require("./models/attachment"),
    Rem         =       require("./models/rem"),
     Notif = require("./models/notif"),
      seedDB      = require("./seeds");
    
// DATABASE

//// ADD YOUR OWN MONGOOSE.CONNECT TO CONNECT TO A DATABASE
mongoose.connect("mongodb://localhost/notes_app");


    
    
// APP CONGI    


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


/// THIS BEGINS THE SEED FUNCTION
seedDB();

// THIS IS A REGULAR EXPRESSION FOR SEARCHING

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//**********************
// RESTFUL ROUTES
//**********************

app.get("/",function(req, res) {
    res.redirect("/notes");
});

// Index route

app.get("/notes",function(req, res){
    if(req.query.search){
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
     
        Note.find({title: regex}, function(err, notes){
       if(err){
           console.log("error!");
       } 
       else{
           res.render("index",{notes: notes}); 
       }
    });
        
    }
    else{
     Note.find({}, function(err, notes){
       if(err){
           console.log("error!");
       } 
       else{
           res.render("index",{notes: notes}); 
       }
    });
    }
});


// new  route

app.get("/notes/new", function(req, res) {
    res.render("new");
});

// create route

app.post("/notes", function(req ,res){
   // create
 
   Note.create(req.body.note, function(err, newNote){
       if(err){
           res.render("new");
       }
       else{
           // redirect to notes page
           res.redirect("/notes");
       }
   });
})

//show more info 

app.get("/notes/:id", function(req, res){
    Note.findById(req.params.id).populate("attachments").exec(function(err, foundNote){
        if(err){
            console.log(err);
        } else {
          //  console.log(foundNote)
            res.render("show", {note: foundNote});
        }
    });
})

// edit route

app.get("/notes/:id/edit",function(req, res) {
    Note.findById(req.params.id, function(err, foundNote){
        if(err){
            res.redirect("/notes");
        } else {
            res.render("edit", {note: foundNote});
        }
    });
    
})

// update route
app.put("/notes/:id",function(req, res){
   Note.findByIdAndUpdate(req.params.id, req.body.note, function(err, updatedNote){
       if(err){
           res.redirect("/notes");
       } else {
           res.redirect("/notes/" + req.params.id);
       }
   });
});


// destroy

app.delete("/notes/:id",function(req ,res){
    Note.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/notes");
        } else {
            res.redirect("/notes");
        }
    })
});

//*******************
//Add attachments
//*******************

app.get("/notes/:id/attachments/new", function(req, res){
    Note.findById(req.params.id, function(err, note){
        if(err){
            console.log(err);
        } else {
             res.render("attachments/new", {note: note});
        }
    })
});



app.post("/notes/:id/attachments", function(req, res){
   Note.findById(req.params.id, function(err, note){
       if(err){
           console.log(err);
           res.redirect("/notes");
       } else {
        Attachment.create(req.body.attachment, function(err, attachment){
           if(err){
               console.log(err);
           } else {
              note.attachments.push(attachment);
               note.save();
               res.redirect('/notes/'+ note._id);
           }
        });
       }
   });
});
      
///******************** 
 //  REMINDER
///******************** 

app.get("/notes/:id/reminder/new", function(req, res){
    Note.findById(req.params.id, function(err, note){
        if(err){
            console.log(err);
        } else {
             res.render("reminder/new", {note: note});
        }
    })
});



app.post("/notes/:id/reminder", function(req, res){
   Note.findById(req.params.id, function(err, note){
       if(err){
           console.log(err);
           res.redirect("/notes");
       } else {
            req.body.reminder.name = note.title;
            req.body.reminder.hours =  req.body.reminder.hours*1000;  // THIS CONVERT TIME INTO MILISECS
        Rem.create(req.body.reminder, function(err, reminder){
           if(err){
               console.log(err);
           } else {
           
             console.log("reminder added");
           //  console.log(req.body.reminder.hours);
     
              console.log(req.body.reminder);
          
             
               res.redirect('/notes/'+ note._id);
           }
        });
       }
   });
});


//////////////*************  REMINDER FUNCTION ******************* //////////////////////// 
function abc (){
Rem.find({}, function(err, rems){
    if(err){
        console.log("error error error");
        console.log(err);
    }
    else{
     rems.forEach(function(nt){
         console.log("this is" +nt.hours);
         if (nt.hours <= 0)
         {
             Rem.findOneAndRemove({hours: 0},function(err,rem){
                        if(err)
                        {
                            console.log("cant delete");
                        }
                        else{
                                var newnotification = new Notif({
                                    name: rem.name 
                                });

                                newnotification.save(function(err,notif){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log("we savend a notification")
                                        console.log(notif.name);
                                    }
                                });
                            console.log("deleted");
                        }
                    });
         }
         if (nt.hours>0)
         {
             Rem.findOne({hours: nt.hours}, function(err, foundTime){
                           if(err)
                {
                    console.log(err);
                }
                else{
      //       console.log(foundTime.hours);
      foundTime.hours = foundTime.hours-1000;

      foundTime.save(function(err,uptime){
          if(err)
          {
              console.log(err);
          }
          else
          {
              console.log("the updted time is " + uptime.hours)
          }
      });
             }
         });
         }
         
     
         });
     
            }
    
});
}

setInterval(abc,1000);

//// ********************* 
////   NOTIFICATION page
////***********************

app.get("/notifications", function(req,res){
    Notif.find({},function(err, notif) {
        if(err){
            console.log("error fo notif");
            console.log(err);
        }
        else
        {
            res.render("notification/notify",{notif: notif});
        }
    });
});

app.delete("/notification/:id",function(req ,res){
    Notif.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/");
        }
    })
});




/// ************** 
// this is local host 

      app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server is running");
})

