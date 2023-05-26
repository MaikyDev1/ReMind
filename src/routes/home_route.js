const router = require('express').Router();
const data = require("../database/models/user_data");
const posts = require("../database/models/posts_data");
var mongoose = require('mongoose');

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

// ROUTING

router.get('/profile/:username', async (req, res) => {
    let foundUser;
    if(!mongoose.isValidObjectId(req.params.username))
        foundUser = await data.findOne({username: req.params.username})
    else 
        foundUser = await data.findById(req.params.username)
    if(foundUser == null) {
        res.render("../404");
        return;
    }
    res.render("profile", {
        user: req.user,
        profile: foundUser,
        cookies: req.cookies
    })
})

router.get('/news', async (req, res) => {
    
})

router.get('/clips', async (req, res) => {
    res.render("clips");
})

router.get('/', async (req, res) => {
    res.render("home", {
        user: req.user,
        cookies: req.cookies
    })
})

router.get('/upload/clip', isAuthenticated, async (req, res) => {
    ;
})

module.exports = router;