var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/");


//=======================
//AUTH Routes
//=======================

//ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});
//REGISTER ROUTE
router.get("/register", function(req, res){
    res.render("register");
});

//SIGN UP Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Registration successful. Welcome " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//SHow Log iin form
router.get("/login", function (req, res) {
    res.render("login");
});
//Log in handler
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//LOGOUT Route

router.get("/logout", middleware.isLoggedIn, function (req, res) {
    req.logout();
    req.flash("success", "Logged out successfully.");
    res.redirect("/campgrounds");
});


module.exports = router;