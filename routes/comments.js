const express = require ("express")
      router = express.Router({mergeParams: true})
      Course = require("../models/course")
      Comment = require("../models/comment")
      middleware = require("../middleware")

//reder form to create a comment
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Course.findById(req.params.id, (err, course)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {course_ejs:course});
        }
    })
});

//create comment and save it to db
router.post("/", middleware.isLoggedIn, (req, res)=>{
    Course.findById(req.params.id, (err, course)=>{
        if(err){
            console.log(err);
            res.redirect("/courses");
        }
        else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    course.comments.push(comment);
                    course.save();
                    req.flash("success", "Successfully added a comment");
                    res.redirect("/courses/" + course._id);
                }
            })
        }
    })
})

//render form to edit a comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, comment)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {course_id:req.params.id, comment_ejs:comment});
        }
    })
})

//update a comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updated_comment)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/courses/" + req.params.id);
        }
    });
});

//delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment deleted");
            res.redirect("/courses/" + req.params.id);
        }
    });
});

module.exports = router