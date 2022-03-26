exports.get404 = (req, res, next) => {
    res.status(404).render('public/404');
};

exports.get500 = (req, res, next) => {
    res.status(500).render('public/500');
}