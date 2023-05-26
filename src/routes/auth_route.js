const router = require('express').Router();
const bcrypt = require('bcrypt');
const data = require("../database/models/user_data");
const { v4: uuidv4 } = require('uuid');

const passport = require("passport");

// AUTHENTICITY

function isAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return next()
    res.redirect("/auth/login")
}

function isNotAuthenticated(req, res, next){
    if(req.isAuthenticated())
        return res.redirect("/")
    next()
}

router.post('/login', isNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/auth/login"
}))

router.get('/login', isNotAuthenticated, async (req, res) => {
    res.render('auth/login', {
        cookies: req.cookies
    });
})

router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password1, 10);
        const newUser = await data.create({
            uuid: uuidv4(),
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            description: req.body.description,
            role: req.body.role,
            gender: req.body.gender,
            intersts: req.body.intrests,
            profile_picture: "default" + (Math.floor(Math.random() * 3) + 1),
            settings: {
                hello: "1"
            }
        });
        const savedUser = await newUser.save();
        console.log(newUser);
        res.redirect("/auth/login");
    } catch (e) {
        console.log(e); 
        res.redirect("/auth/register");
    }
})

router.get('/register', isNotAuthenticated, async (req, res) => {
    res.render('auth/register', {
        cookies: req.cookies
    });
})

router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

module.exports = router;