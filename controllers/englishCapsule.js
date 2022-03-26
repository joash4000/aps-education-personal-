const EnglishCapsule = require('../modals/EcapsuleEnglish');

const fileHelper = require('../util/file');

exports.getEnglishCapsule = async(req, res, next) => {
    try {
        const videos = await EnglishCapsule.find().sort({ createdAt: -1 });
        res.render('englishCapsule', { videos });
    } catch (err) {
        next(err);
    }
}

exports.postAddEnglish = async(req, res, next) => {
    try {
        let { active } = req.body;
        let link;
        if (req.files.photo) {
            link = req.files.photo[0].path.replace("\\", "/");
        }
        if (req.validatesError) {
            await fileHelper.deleteFile(link);
        }
        if (!link) {
            await fileHelper.deleteFile(link);
            req.flash('errorMessage', 'Please provide a file.');
            return res.redirect('/admin/ecapsule-english');
        }
        let deleteLink = link;
        link = process.env.URL + '/' + link;
        const exists = await EnglishCapsule.find();
        if (exists.length > 0) {
            await fileHelper.deleteFile(exists[0].deleteLink);
            exists[0].link = link;
            exists[0].active = (active) ? true : false;
            exists[0].deleteLink = deleteLink;
            await exists[0].save();
        } else {
            const newVideo = new EnglishCapsule({ link, active: (active) ? true : false, deleteLink });
            await newVideo.save();
        }
        return res.redirect('/admin/ecapsule-english');
    } catch (err) {
        next(err);
    }
}

exports.getChangeEnglishCapsuleState = async(req, res, next) => {
    try {
        const video = await EnglishCapsule.findById(req.query.id);
        if (!video) {
            return res.redirect('/admin/ecapsule-english');
        }
        video.active = !video.active;
        await video.save();
        return res.redirect('/admin/ecapsule-english');
    } catch (err) {
        next(err);
    }
}