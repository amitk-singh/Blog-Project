var bodyParser  = require("body-parser"),
	mongoose    =require("mongoose"),
	express		=require("express"),
	app			=express(),
	methodOverride=require("method-override");// (Form only support PUT & GET req so     for using PUT,DELETE,PATCH we require this package..)

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// connecting to mongo-DB
mongoose.connect("mongodb://127.0.0.1:27017/blogs",{
	useNewUrlParser: true,
	useCreateIndex:true,
	useUnifiedTopology: true
}).then(() =>{
	console.log("connect to db");
}).catch(err =>{
	console.log("error",err.message);
});	

//schema
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created:{type:Date,default: Date.now}
});

//MODEL
var Blog = mongoose.model("Blogx",blogSchema);

// RESTFUL ROUTES

app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR");
		}else{
		res.render("index.ejs",{blogs:blogs});	
		}
	});	
	
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new.ejs");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
	//create blog
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new.ejs");
		}else{
			//redirect to index page
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show.ejs",{blog:foundBlog});
		};
	});
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit.ejs",{blog:foundBlog});
		};
	});
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id);
		};
	});
});

// DELETE ROUTE
app.delete("/blogs/:id",function(req,res){
	//destroy blog
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
});

app.listen(3000,function(){
	console.log("server started");
})