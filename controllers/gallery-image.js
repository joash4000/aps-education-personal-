const GalleryImage = require('../modals/GalleryImage');
const fileHelper = require('../util/file');

exports.getGalleryImage = async(req, res, next) => {
    try {
        const images = await GalleryImage.find().sort({ 'createdAt': -1 });
        res.render('gallery', { images, errorMessage: null });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.postGalleryImageCreate = async(req, res, next) => {
    try {
        const { altText } = req.body;
        let imageUrl;
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/gallery');
        }
        console.log(req.files)
        if (req.files.photo) {
            imageUrl = req.files.photo[0].path.replace("\\", '/');
        }
        const newBanner = new GalleryImage({ altText, imageUrl });
        await newBanner.save();
        res.redirect('/admin/gallery');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}


exports.getDeleteGalleryImage = async(req, res, next) => {
    try {
        const id = req.params.id;
        const banner = await GalleryImage.findById(id);
        await banner.remove();
        if (banner.imageUrl) {
            await fileHelper.deleteFile(banner.imageUrl);
        }
        res.redirect('/admin/gallery');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}