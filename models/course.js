const mongoose = require("mongoose");

var courseSchema = new mongoose.Schema({
    code: String,
    name: String,
    difficulty:String, 
    rating: String,
    description: String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

module.exports = mongoose.model("Course", courseSchema);