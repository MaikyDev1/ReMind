const router = require('express').Router();

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

router.get('/profile', async (req, res) => {
    if(req.body == null)
        return res.redirect("../404");
    res.render("profile", {
        requser: req.user
    })
})

router.get('/news', async (req, res) => {
    
})

router.get('/clips', async (req, res) => {
    res.render("clips");
})

router.get('/', async (req, res) => {
    res.render("home", {
        requser: req.user
    })
})

router.get('/upload/clip', isAuthenticated, async (req, res) => {
    ;
})

module.exports = router;