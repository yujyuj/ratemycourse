const Course = require("../models/course")
const Comment = require("../models/comment")
const middlewareObj = {}

//authentication
middlewareObj.isLoggedIn = (req, res, next)=>{
	if(req.isAuthenticated()){return next();}
	req.flash("error", "Please log in first");
	res.redirect("/login");
}

//authorization for admin
middlewareObj.isAdmin = (req, res, next)=>{
	if(req.isAuthenticated() && req.user.admin){return next();}
	req.flash("error", "Permission denied");
	res.redirect("back");
}

//authorization for a comment
middlewareObj.checkCommentOwnership = (req,res,next)=>{
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id,(err,foundComment)=>{
			if(err){res.redirect("back")}
			else{
				if(foundComment.author.id.equals(req.user._id)){next()}
				else{
					req.flash("error", "Permission denied")
					res.redirect("back")
				}
			}	
		})
	}
	else{
		req.flash("error", "Please log in first")
		res.redirect("back")
	}
}

module.exports = middlewareObj


