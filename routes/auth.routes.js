const router = require("express").Router();
const User = require('../models/User.model.js')
const bcrypt = require('bcryptjs');


// GET "/auth/signup" => renderizar la vista form registro
router.get("/signup", async (req, res, next) =>{
    res.render("auth/signup.hbs")
})

// POST "/auth/signup" => recibir info del form de registro
router.post("/signup", async (req, res, next) =>{

    const { username, password } = req.body

    //validación campos llenos
    if(username === "" || password === "") {
    res.render("auth/signup.hbs", {
    errorMessage: "Rellena todos los campos"
    })
    return;
    }

    // validación fuerza de la password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
    if (passwordRegex.test(password) === false) {
        res.render("auth/signup.hbs", {
            errorMessage: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
        })
        return; 
    }

        try {
            // validación de que el usuario no esté registrado
            const foundUser = await User.findOne( { username: username } )
            if (foundUser !== null) {
                // el usuario ya existe
                res.render("auth/signup.hbs", {
                    errorMessage: "Este usuario ya está registrado"
                })
                return;
            }

            // cifrar contraseña (salt y hash)
            const salt = await bcrypt.genSalt(12);
            const hashPassword = await bcrypt.hash(password, salt);

            // crear perfil del usuario
            const newUser = {
                username: username,
                password: hashPassword
            }
            await User.create(newUser)

            res.redirect("/auth/login")

        } catch (error) {
            next(error)
            
        }




})



module.exports = router;