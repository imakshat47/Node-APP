const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middelware/auth')

// @desc Login/ Landing page
//  @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

// @desc Dashboard
//  @route GET / Dashboard 
router.get('/Dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name: req.user.firstName
    })
})


module.exports = router