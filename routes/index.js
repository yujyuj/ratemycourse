const express = require ("express");
      course = require("../models/course");
      router = express.Router()
      passport = require("passport")
      User = require("../models/user")

//root
app.get("/", (req, res)=>{
    //res.render("landing");
    res.redirect("/courses");
});

//auth route
router.get("/register", (req, res)=>{
    res.render("register");
})

router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            req.flash("error", err.message);
            return res.redirect("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Thanks for signing up " + user.username)
            res.redirect("/courses");
        });
    });
});

router.get("/login", (req, res)=>{
    res.render("login");
});

//log in
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/courses",
        failureRedirect:"/login"
    }), (req, res)=>{

});

//log out
router.get("/logout", (req, res)=>{
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/courses");
})

module.exports = router