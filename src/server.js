import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use('/public',express.static(__dirname + '/public'));

app.get("/", (req,res) => {
    res.render("home");
})
app.get("/*",(req,res)=>{
    // 다른 모든 경로를 홈으로 돌려보냄
    res.redirect("/");
})

app.listen(3000, () => {
    console.log(`Listening on http://localhost:3000/`);
});