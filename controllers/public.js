const path = require('path');
const ejs = require('ejs');

const BoardOfGoverners = require('../modals/BoardGoverners');
const AdvisoryBoard = require('../modals/AdvisoryBoard');
const CoreFaculties = require('../modals/CoreFaculties');
const News = require('../modals/News');
const BannerImage = require('../modals/BannerImage');
const GalleryImage = require('../modals/GalleryImage');
const Partners = require('../modals/Partners');
const ScrollingNews = require('../modals/ScrollingNews');
const VideoCapsule = require('../modals/EcapsuleVideo');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID.trim());


exports.postContact = (req, res, next) => {
    const { name, email, phone, message } = req.body;
    ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'email', 'query.ejs'), { name, email, phone, message }, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            const mainOptions = {
                to: process.env.ADMIN_EMAIL,
                from: process.env.EMAIL,
                text: 'New Query From' + name,
                subject: 'New Query From' + name,
                html: data
            };
            sgMail.send(mainOptions)
                .then(sgData => {
                    console.log("Email Sent");
                }).catch(e => {
                    console.log(e);
                });
        }
    });
    res.redirect('/contact');
}

exports.getAdvisoryBoard = async(req, res, next) => {
    try {
        const members = await AdvisoryBoard.find();
        res.render('public/advisory_board', { members });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getBoardOfGoverners = async(req, res, next) => {
    try {
        const members = await BoardOfGoverners.find();
        res.render('public/board_of_governors', { members });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCoreFaculties = async(req, res, next) => {
    try {
        const members = await CoreFaculties.find();
        res.render('public/our_faculties', { members });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getNews = async(req, res, next) => {
    try {
        const news = await News.find().sort({ "createdAt": -1 });
        res.render('public/latest_news', { news });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getBannerImage = async(req, res, next) => {
    try {
        const images = await BannerImage.find().sort({ "createdAt": -1 });
        const gallery = await GalleryImage.find().sort({ 'createdAt': -1 });
        const partners = await Partners.find();
        const news = await ScrollingNews.find();
        res.render('index', { images, gallery, partners, news });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getGallery = async(req, res, next) => {
    try {
        const gallery = await GalleryImage.find().sort({ 'createdAt': -1 });
        res.render('public/galleryPage', { gallery });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getVideoCapsule = async(req, res, next) => {
    try {
        const videos = await VideoCapsule.find({ active: true }).sort({ createdAt: -1 });
        res.render('public/video', { videos });
    } catch (err) {
        next(err);
    }
}