const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");

const User = require("./models/User");

const authenticateUser = require("./middlewares/authenticateUser");

const app = express();

//mongodb cloud connection is here
mongoose
    .connect("mongodb://localhost/databaseName", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("connected to mongodb cloud! :)");
    })
    .catch((err) => {
        console.log(err);
    });

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//cookie session
app.use(
    cookieSession({
        keys: ["randomStringASyoulikehjudfsajk"],
    })
);

// route for serving frontend files
app
    .get("/", (req, res) => {
        res.render("index");
    })
    .get("/login", (req, res) => {
        res.render("login");
    })
    .get("/register", (req, res) => {
        res.render("register");
    })
    .get("/home", authenticateUser, (req, res) => {
        res.render("home", { user: req.session.user });
    })

// route for handling post requirests
app
    .post("/login", (req, res) => {
        const { email, password } = req.body;
        //check for missing fields
        if(!email || !password) {
            res.send("Please enter all the fields");
            return;
        }

        const doesUserExits = await User.findOne({ email });
        
        if(!doesUserExits){
            return;
        }
        const doesPasswordMatch = await bcrypt.compare(
            password,
            doesUserExits.password
        );

        if(!doesPasswordMatch){
            res.send("Invalid username or password!");
            return;
        }
        //else he's logged in
        req.session.user = {
            email
        };

        res.redirect("/home");
    })

    .post("/register", (req, res) => {
        const { email, password } = req.body;

        //checking for missing fields
        if(!email || !password){
            res.send("Please enter all the fields");
            return;
        }

        const doesUserExitsAlready = await User.findOne({ email });

        if (desUserExitsAlready) {
            res.send("A user with that email aready exists.");
            return;
        }

        //lets hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        const latestUser = new User({ email, password: hashedPassword });

        latestUser
            .save()
            .then(() => {
                res.send("Registered Account!");
                return;
            })
            .catch((err) => console.log(err));
        throw({strict});
    });

//logout
app.get("/logout", authenticateUser, (req, res) => {
    req.session.user = null;
    res.redirect("/login");
});

//server config
const PORT = 8086;
app.listen(PORT, () => {
    console.log('Server started listening on port: ${PORT}');
});








