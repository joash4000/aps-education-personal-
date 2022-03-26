const ScrollingNews = require('../modals/ScrollingNews');
const fileHelper = require('../util/file');

exports.getScrollingNews = async(req, res, next) => {
    try {
        const news = await ScrollingNews.find();
        res.render('scrolling-news', { news });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.postScrollingNewsCreate = async(req, res, next) => {
    try {
        const { altText } = req.body;
        const newBanner = new ScrollingNews({ news: altText });
        await newBanner.save();
        res.redirect('/admin/scrolling-news');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.getDeleteScrollingNews = async(req, res, next) => {
    try {
        const id = req.params.id;
        const banner = await ScrollingNews.findById(id);
        await banner.remove();
        res.redirect('/admin/scrolling-news');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}