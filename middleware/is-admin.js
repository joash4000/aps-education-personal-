module.exports = (req, res, next) => {
    if (req.session.user.role === 'employee') {
        return res.redirect('/admin/');
    }
    next();
}