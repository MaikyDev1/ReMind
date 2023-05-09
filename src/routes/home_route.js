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

router.get('/news', async (req, res) => {
    
})

router.get('/clips', async (req, res) => {
    
})

router.get('/', async (req, res) => {
    
})

router.get('/upload/clip', isAuthenticated, async (req, res) => {
    res.render("home");
})

module.exports = router;