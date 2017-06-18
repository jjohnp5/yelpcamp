var mongoose = require("mongoose");
    Campground = require("./models/campground");
    Comment = require("./models/comment");


function seedDB() {
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            //add campgrounds
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added campgrounds");
                        //create comment
                        Comment.create(
                            {
                                text: "This place sucks.",
                                author: "Jimmy"
                            }, function (err, comment) {
                                if(err){
                                    console.log(err)
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("successful comment");
                                }
                            }
                            );
                    }
                });
            });
        }
    });

}

module.exports = seedDB;
