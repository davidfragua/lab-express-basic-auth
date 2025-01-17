const router = require("express").Router();
const User = require("../models/User.model")
const { isLoggedIn } = require("../middlewares/auth.middlewares")


// GET ("/profile") => el usuario puede ver su perfil
router.get("/", isLoggedIn, (req, res, next) =>{

    User.findById(req.session.activeUser._id)
    .then((response) =>{
        res.render("profile/my-profile.hbs", {
            userDetails: response
        })
    })
    .catch((error) => {
        next(error)
    })
})







module.exports = router;