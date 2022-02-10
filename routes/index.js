const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/signup', function(req,res) {
  res.render('signup')
})


router.post('/signup', function(req, res) {
  let errors = [];

  if (!req.body.username) {
    errors.push("You didn't include a name!")
  }
  if (!req.body.password) {
    errors.push("you need a password!")
  }

  if (errors.length > 0) {
    console.log("ERRORS SIGING UP", errors)
    res.render('signup', errors)
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(req.body.password, salt)

  User.create({
    username: req.body.username,
    password: hashedPass
  })
  .then(createdUser => {
    console.log("user was created woo!!", createdUser)
    res.render('profile')
    // Add session
    console.log(req.session)
    req.session.user = createdUser;
    console.log(req.session.user)
    // render
  })
  .catch(err => console.log("ERROR CREATING USER", err))
})


module.exports = router;
