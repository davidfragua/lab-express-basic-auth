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


    // GET "auth/login" => renderiza la vista del form de login
    router.get("/login", (req, res, next) =>{
        res.render("auth/login.hbs")
    })


    // POST "auth/login" => recibe las credenciales el usuario y lo valida
    router.post("/login", async (req, res, next) =>{

        const { username, password } = req.body

        // validaciones backend
        if(username === "" || password === "") {
            res.render("auth/login.hbs", {
            errorMessage: "Debes completar todos los campos"
            })
            return;
        }

        try {
            // verificar que el usuario existe
        const foundUser = await User.findOne( { username: username })
            if(foundUser === null) {
                res.render("auth/login.hbs", {
                    errorMessage: "Credenciales incorrectas"
                })
                return;
            }

            // verificar la contrseña del usuario coincide con la suya
            const isPasswordValid = await bcrypt.compare(password, foundUser.password)
            if(isPasswordValid === false) {
                // no coincide
                res.render("auth/login.hbs", {
                    errorMessage: "Credenciales incorrectas"
                })
                return;
            }


            // crear la sesión/cookie para usuarios activos
            req.session.activeUser = foundUser;

            // asegurar que se ha creado la sesión y redirigir
            req.session.save(() => {
                res.redirect("/profile")
            })
        } catch (error) {
            next(error)
        }
    })

    //GET "/auth/logout" => cerrar la sesión 
        router.get("/logout", (req, res, next) => {
        req.session.destroy(() => {
        res.redirect("/")
        })
    })



module.exports = router;