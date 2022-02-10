const router = require("express").Router();
const userLogged = require('../middleware/userLogged');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", function (req, res) {
  res.render("signup");
});

router.post("/signup", function (req, res) {
  let errors = [];

  if (!req.body.username) {
    errors.push("You didn't include a name!");
  }
  if (!req.body.password) {
    errors.push("you need a password!");
  }

  if (errors.length > 0) {
    console.log("ERRORS SIGING UP", errors);
    res.render("signup", errors);
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hashedPass,
  })
    .then((createdUser) => {
      console.log("user was created woo!!", createdUser);
      res.render("userPages/main");
      // Add session
      console.log(req.session);
      req.session.user = createdUser;
      console.log(req.session.user);
      // render
    })
    .catch((err) => console.log("ERROR CREATING USER", err));
});

//Login
router.get("/login", (req, res) => res.render("login"));

router.post("/login", (req, res) => {
  let errorMessage = "Check username or password";
  if (!req.body.username || !req.body.password) {
    return res.render("login", { errorMessage });
  }
  User.findOne({ username: req.body.username }).then((foundUser) => {
    if (!foundUser) {
      errorMessage = "User can not be found";
      return res.render("login", { errorMessage });
    }
    const match = bcrypt.compareSync(req.body.password, foundUser.password);
    if (!match) {
      errorMessage = "password incorrect";
      return res.render("login", { errorMessage });
    } else {
      req.session.user = foundUser;
      console.log(req.session.user);
      res.redirect("/main");
    }
  });
});

// Logout / End Session
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

// Once Logged in, User can access these routes
router.get('/main', userLogged, (req, res) => {
  res.render('userPages/main');
})

router.get('/private', userLogged, (req, res) => {
  res.render('userPages/private')
})


module.exports = router;
