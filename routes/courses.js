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

//add a course to db, then redirect to page courses and the newly added course will show up
router.post("/", middleware.isLoggedIn, (req, res)=>{
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

//display the form of adding a new course
router.get("/new", middleware.isLoggedIn, (req,res)=>{
    res.render("courses/new")
});

//show info of each course
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

// update a course
// router.get("/:id/edit", middleware.CheckCourseOwnership, (req, res)=>{
// })

// destroy a course
// router.delete("/:id", middleware.CheckCourseOwnership, (req, res)=>{
// })

module.exports = router