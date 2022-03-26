const BannerImage = require('../modals/BannerImage');
const fileHelper = require('../util/file');

exports.getBannerImage = async(req, res, next) => {
    try {
        const images = await BannerImage.find().sort({ 'createdAt': -1 });
        res.render('banner-image', { images });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.postBannerImageCreate = async(req, res, next) => {
    try {
        const { altText } = req.body;
        let imageUrl;
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/banner-image');
        }
        if (req.files.photo) {
            imageUrl = req.files.photo[0].path.replace("\\", "/");
        }
        const newBanner = new BannerImage({ altText, imageUrl });
        await newBanner.save();
        res.redirect('/admin/banner-image');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.getDeleteBannerImage = async(req, res, next) => {
    try {
        const id = req.params.id;
        const banner = await BannerImage.findById(id);
        await banner.remove();
        if (banner.imageUrl) {
            await fileHelper.deleteFile(banner.imageUrl);
        }
        res.redirect('/admin/banner-image');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}