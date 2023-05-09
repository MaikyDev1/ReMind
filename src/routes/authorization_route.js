const router = require('express').Router();
const bcrypt = require('bcrypt');

// REGISTER ROUTE

router.post('/authorization/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password);
    } catch {

    }
})

router.get('/authorization/register', async (req, res) => {
    
})