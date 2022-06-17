const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const loggedIn = require('../middlewares')

router.get('/', loggedIn, (req, res, next) => {
    res.render('main')
})



module.exports = router;