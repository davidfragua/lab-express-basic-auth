const router = require("express").Router();
const User = require("../models/User.model")
const { isLoggedIn } = require("../middlewares/auth.middlewares")

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)

const profileRoutes = require("./profile.routes")
router.use("/profile", profileRoutes)

// GET ("/main") => el usuario puede ver /main
router.get("/main", isLoggedIn, (req, res, next) =>{

  User.findById(req.session.activeUser._id)
  .then((response) =>{
      res.render("profile/main.hbs", {
          userDetails: response
      })
  })
  .catch((error) => {
      next(error)
  })
})

// GET ("/private") => el usuario puede ver /private
router.get("/private", isLoggedIn, (req, res, next) =>{

  User.findById(req.session.activeUser._id)
  .then((response) =>{
      res.render("profile/private.hbs", {
          userDetails: response
      })
  })
  .catch((error) => {
      next(error)
  })
})


module.exports = router;
