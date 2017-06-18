var express = require("express");
var router = express.Router({mergeParams: true}); //MergeParams for Parsing URL Params
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/");


//COMMENTS ROUTE
//NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            req.flash("error", err.message);
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//CREATE/POST ROUTE
router.post("/", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    req.flash("error", "Comment post failed, try again.");
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Comment posted successfully.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, comment) {
       if(err){
           req.flash("error", err.message);
           res.redirect("back");
       } else{
           res.render("comments/edit", {campground_id: req.params.id, comment: comment});
       }
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
      if(err){
          req.flash("error", err.message);
          res.redirect("back");
      } else{
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function (req,res) {
   Comment.findByIdAndRemove(req.params.comment_id, function (err) {
       if(err){
            req.flash("error", err.message);
            res.redirect("back");
       }else{
           req.flash("success", "Removed comment successfully.");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});




module.exports = router;