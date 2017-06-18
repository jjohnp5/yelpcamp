var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/");



router.get("/", function(req, res){
    //get campgrounds from DB
    Campground.find({}, function(err, camp){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: camp});
        }
    })
    // res.render("campgrounds", {campgrounds: campgrounds});
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from forms
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: description, author : author};
    //create new camp ground to DB
    Campground.create(newCampground, function(err, camp){
        if(err){
            console.log("Failed");
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    });

});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});
//SHOW 
router.get("/:id", function(req, res){
    //find camp ground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });

});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
       res.redirect("/campgrounds/" + req.params.id);
   });
});
//DELETE Campground
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, campground) {
       res.redirect("/campgrounds");
    });
});






module.exports = router;