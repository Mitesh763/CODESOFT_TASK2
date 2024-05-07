const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const QuizUser = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const sessionOption = {
  secret: "mtSecretKey",
  resave: true,
  saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(QuizUser.authenticate()));
passport.serializeUser(QuizUser.serializeUser());
passport.deserializeUser(QuizUser.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.err = req.flash("err");
  res.locals.currUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("quiz/index.ejs");
});

app.get("/quiz", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "public", "html", "index.html"));
  } else {
    req.flash("err", "Log-in must Required......!")
    res.render("quiz/index.ejs");
  }
});


app.get("/signup", (req, res) => {
  res.render("quiz/signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUserQ = new QuizUser({ username, email });
    let registerUser = await QuizUser.register(newUserQ, password);
    req.flash("success", "sign-up Successfully");
    res.redirect("/login");
  } catch (error) {
    req.flash("err", error.message);
    res.redirect("/signup");
  }

});

app.get("/login", (req, res) => {
  res.render("quiz/login.ejs");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "sign-up Successfully");
    res.redirect("/");
  }
);

app.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        console.log(err);
        next(err);
      }
      req.flash("success", "Logout Successfully");
      res.redirect("/");
    })
  } catch (error) {
    req.flash("err", error.message);
    res.redirect("/login");
  }
});

app.listen(8080, () => console.log(`Server Started at http://localhost:8080`));
