const News = require('../modals/News');

exports.getNews = async(req, res, next) => {
    try {
        const news = await News.find().sort({ 'createdAt': -1 });
        res.render('news-list', { news });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getNewsCreate = (req, res, next) => {
    res.render('news-create', { errorMessage: null });
}

exports.postNewsCreate = async(req, res, next) => {
    try {
        const news = req.body.news;
        const heading = req.body.heading;
        const newnews = new News({ heading, news });
        await newnews.save();
        res.redirect('/admin/news');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getEditNews = async(req, res, next) => {
    try {
        const id = req.params.id;
        const news = await News.findById(id);
        res.render('news-edit', { news, errorMessage: null });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.postEditNews = async(req, res, next) => {
    try {
        const { _id, heading, news } = req.body;
        const oldNews = await News.findById(_id);
        oldNews.heading = heading;
        oldNews.news = news;
        await oldNews.save();
        res.redirect('/admin/news');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getDeleteNews = async(req, res, next) => {
    try {
        const id = req.params.id;
        const news = await News.deleteOne({ '_id': id });
        res.redirect('/admin/news');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}