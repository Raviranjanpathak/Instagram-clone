const express=require("express");
const app=express();

const {v4:uuidv4}=require("uuid");


const methodOverride=require("method-override");

const multer=require("multer");
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/images");
    },
    filename:function (req,file,cb){
        cb(null,Date.now()+"_"+file.originalname);
    }
});
const image=multer({storage});

const port=3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

const path=require("path");
app.set("view engine" ,"ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
 
let posts=[
    {
        id:uuidv4(),
        username:"Ravi",
        content:"I loving coding",
        image: "/images/p1.jpg",
        likes:200,
        comments:300,
    },
    {
        id:uuidv4(),
        username:"AmishaBkloliya",
        content:"i love chugli",
        image: "/images/p2.jpg",
        likes:200,
        comments:300,
    },
    {
        id:uuidv4(),
        username:"ChhotiChudial",
        content:"I love Blood",
        image: "/images/p3.jpg",
        likes:200,
        comments:300,
    },
   
];
app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});

app.get("/posts/new",(req,res)=>{
    res.render("form.ejs");
});

app.post("/posts",image.single("image"),(req,res)=>{
    let id=uuidv4();
    let{username,content,likes,comments}=req.body;
    const imagePath="/images/"+req.file.filename;
    posts.push({
        id,
        username,
        content,
        likes,
        comments,
        image:imagePath 
    });
    res.redirect("/posts");
});

app.get("/posts/:id",(req,res)=>{
    let{id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("show.ejs",{post});
});

app.get("/posts/:id/edit",(req,res)=>{
    let{id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("edit.ejs",{post});
});

app.patch("/posts/:id/",(req,res)=>{
    let{id}=req.params;
    let {newContent,newLikes,newComment}=req.body;
    let post=posts.find((p)=>id===p.id);
    post.content=newContent;
    post.likes=newLikes;
    post.comments=newComment;
    res.redirect("/posts")
});

app.delete("/posts/:id",(req,res)=>{
    let{id}=req.params;
    posts=posts.filter((p)=> p.id !== id);
    res.redirect("/posts");
});

app.listen(port,()=>{
    console.log(`Listening(rest) port:${port}`);
});