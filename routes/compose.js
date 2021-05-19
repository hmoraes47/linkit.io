const router = require("express").Router();
const Blog = require("../models/Blog");

router
    .get("/compose", (req, res) => {
        res.render("comsposeBlog");
    })

    .post("/compose", (req, res) => {
        const { title, content } = req.body;
        if(!title || !content)
            return res.send("Por favor preencha todos os campos obrigatórios.");
        const newBlog = new Blog({ title, content });

        newBlog
            .save()
            .then(() => {
                console.log("Blog salvo com sucesso!");
                res.redirect("/");
            })
            .catch((err) => console.log(err));
    });

module.exports = router;