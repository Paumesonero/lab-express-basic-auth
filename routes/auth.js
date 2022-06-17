const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const loggedIn = require('../middlewares')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/signup', async (req, res, next) => {
    res.render('auth/signup');
})

router.post('/signup', async (req, res, next) => {
    const { username, password } = req.body
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await User.create({ username, hashedPassword });
        res.json(user)
    } catch (error) {
        next(error)
    }
})


router.get('/login', async (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.render('auth/login', { error: 'please fill everything' })
        return;
    }

    try {
        const user = await User.findOne({ username: username })

        if (!user) {
            res.render('auth/login', { error: 'username is taken' })
            return;
        } else {

            const checkedPassword = await bcrypt.compare(password, user.hashedPassword)

            if (checkedPassword) {
                req.session.currentUser = user;
                res.render('index', user)
            } else {
                res.render('auth/login', { error: 'password and username dont match' })
                return
            }
        }

    } catch (error) {
        next(error)
    }
})
module.exports = router;