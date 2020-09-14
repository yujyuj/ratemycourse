
const  express    = require('express')
	   app        = express()
	//    request    = require('request')
	   mongoose   = require('mongoose')
    //    Campground = require('./models/campground')
	//    Comment    = require('./models/comment')
    //    User       = require('./models/user')    
	//    seedDB     = require('./seeds')
    //    flash      = require('connect-flash')
    //    passport   = require('passport')
    //    LocalStrategy = require('passport-local')
    //    methodOverride = require('method-override')

    app.use(express.urlencoded({extended:true}));
    app.set("view engine", "ejs");
    
    //connect to atlas
    mongoose.connect('mongodb+srv://yuj:12345@cluster0.wi8wd.mongodb.net/<dbname>?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to db');
    }).catch(err => {
        console.log('ERROR:', err.message);
    });
    //schema
    var courseSchema = new mongoose.Schema({
        code: String,
        name: String,
        difficulty:String,
        rating: String,
        description: String
    });
    var course = mongoose.model("Course", courseSchema);


    app.get("/", (req, res)=>{
        res.render("landing");
    });

    //display all courses
    app.get("/courses", (req, res)=>{
        course.find({}, (err, courses)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render("index",{courses_ejs:courses})
            }
        })
    });

    //add a course to db, then redirect to page courses and the newly added course will show up
    app.post("/courses", (req, res)=>{
        var code = req.body.code;
        var name = req.body.name;
        var description = req.body.description;
        course.create({
            code:code, 
            name:name,
            difficulty: "0.0",
            rating: "0.0",
            description:description
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
    app.get("/courses/new", (req,res)=>{
        res.render("new")
    });

    //show info of each course
    app.get("/courses/:id", (req, res)=>{
        course.findById(req.params.id, (err, found_course)=>{
            if(err){
                console.log(err);
            }
            else{
                res.render("show", {course_ejs:found_course});
            }
        });
    });


    app.listen(process.env.PORT || 3000,()=>{
        console.log('Server running')
    })