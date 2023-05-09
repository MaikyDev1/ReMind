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
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true
}))

router.get('/login', isNotAuthenticated, async (req, res) => {
    res.render('auth/login');
})

router.post('/register', isNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await data.create({
            uuid: uuidv4(),
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            settings: {}
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
    res.render('auth/register');
})

router.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
})

module.exports = router;