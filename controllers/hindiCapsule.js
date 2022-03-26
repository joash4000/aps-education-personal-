const HindiCapsule = require('../modals/EcapsuleHindi');

exports.getHindiCapsule = async(req, res, next) => {
    try {
        const videos = await HindiCapsule.find().sort({ createdAt: -1 });
        res.render('hindiCapsule', { videos });
    } catch (err) {
        next(err);
    }
}

exports.postAddHindi = async(req, res, next) => {
    try {
        const { link, active } = req.body;
        if (link.trim().length === 0) {
            req.flash('errorMessage', 'Please provide a link.');
            return res.redirect('/admin/ecapsule-hindi');
        }
        const exists = await HindiCapsule.find();
        if (exists.length > 0) {
            exists[0].link = link;
            exists[0].active = (active) ? true : false;
            await exists[0].save();
        } else {
            const newVideo = new HindiCapsule({ link, active: (active) ? true : false });
            await newVideo.save();
        }
        return res.redirect('/admin/ecapsule-hindi');
    } catch (err) {
        next(err);
    }
}

exports.getChangeHindiCapsuleState = async(req, res, next) => {
    try {
        const video = await HindiCapsule.findById(req.query.id);
        if (!video) {
            return res.redirect('/admin/ecapsule-hindi');
        }
        video.active = !video.active;
        await video.save();
        return res.redirect('/admin/ecapsule-hindi');
    } catch (err) {
        next(err);
    }
}