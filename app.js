
const  express    = require("express")
       app        = express()
       mongoose   = require("mongoose")
       Course     = require("./models/course")
       Comment    = require("./models/comment")
       User       = require("./models/user")    
       flash      = require("connect-flash")
       passport   = require("passport")
       LocalStrategy = require("passport-local")
       methodOverride = require("method-override")
       dotenv = require("dotenv").config()
    
// require routes
const courseRoutes  = require("./routes/courses")
      commentRoutes = require("./routes/comments")
      indexRoutes   = require("./routes/index")

//connect to mongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.log("ERROR:", err.message);
});
    
// app.use () will be used everywhere
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"))
app.use(flash())
app.locals.moment = require("moment")

// passport configuration
app.use(methodOverride("_method"))
app.use(require("express-session")({
    secret:"123",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.errormessage = req.flash("error");
    res.locals.successmessage = req.flash("success");
    next();
})

app.use("/courses", courseRoutes);
app.use("/courses/:id/comments", commentRoutes);
app.use("/", indexRoutes);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server running")
});