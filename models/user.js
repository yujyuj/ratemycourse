var mongoose = require("mongoose");
    passportLocalMongoose = require("passport-local-mongoose")

var userSchema = new mongoose.Schema({
	username:String,
	password:String
})

userSchema.plugin(passportLocalMongoose) // it adds methods to User model
module.exports=mongoose.model("user", userSchema);