module.exports = loggedin = (req, res, next) => {
    if (!req.session.currentUser) {
        res.redirect('/auth/login')
    }
    next()
}