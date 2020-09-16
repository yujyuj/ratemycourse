const express = require ("express")
      router = express.Router()
      Course = require("../models/course")
      middleware = require("../middleware")

//display all courses
router.get("/", (req, res)=>{
    Course.find({}, (err, courses)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("courses/index",{courses_ejs:courses});
        }
    })
});

//add a course to db
router.post("/", middleware.isAdmin, (req, res)=>{
    var code = req.body.code;
    var name = req.body.name;
    var description = req.body.description;
    var author = {
        id:req.user._id,
        username:req.user.username
    }
    course.create({
        code:code, 
        name:name,
        difficulty: "0.0",
        rating: "0.0",
        description:description,
        author:author
    }, (err, course)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/courses");
        }
    });
});

//display form to add a course
router.get("/new", middleware.isAdmin, (req,res)=>{
    res.render("courses/new")
});

//show each course
router.get("/:id", (req, res)=>{
    Course.findById(req.params.id).populate("comments").exec((err, found_course)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("courses/show", {course_ejs:found_course});
        }
    });
});

// display form to update a course
router.get("/:id/edit", middleware.isAdmin, (req, res)=>{
    Course.findById(req.params.id, (err, course)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.render("courses/edit", {course_ejs:course});
        }
    });
});

// update a course
router.put("/:id", middleware.isAdmin, (req, res)=>{
    Course.findByIdAndUpdate(req.params.id, req.body.course, (err, updated_course)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/courses/" + req.params.id);
        }
    });
});

// destroy a course
router.delete("/:id", middleware.isAdmin, (req, res)=>{
    Course.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Course deleted");
            res.redirect("/courses/");
        }
    });
})


module.exports = router