const VideoCapsule = require('../modals/EcapsuleVideo');

exports.getVideoCapsule = async(req, res, next) => {
    try {
        const videos = await VideoCapsule.find().sort({ createdAt: -1 });
        res.render('videoCapsule', { videos });
    } catch (err) {
        next(err);
    }
}

exports.postAddVideo = async(req, res, next) => {
    try {
        const { link, active } = req.body;
        if (link.trim().length === 0) {
            req.flash('errorMessage', 'Please provide a link.');
            return res.redirect('/admin/ecapsule-video');
        }
        const newVideo = new VideoCapsule({ link, active: (active) ? true : false });
        await newVideo.save();
        return res.redirect('/admin/ecapsule-video');
    } catch (err) {
        next(err);
    }
}

exports.getChangeVideoCapsuleState = async(req, res, next) => {
    try {
        const video = await VideoCapsule.findById(req.query.id);
        if (!video) {
            return res.redirect('/admin/ecapsule-video');
        }
        video.active = !video.active;
        await video.save();
        return res.redirect('/admin/ecapsule-video');
    } catch (err) {
        next(err);
    }
}


exports.getDeleteVideoCapsule = async(req, res, next) => {
    try {
        const video = await VideoCapsule.findById(req.query.id);
        if (!video) {
            return res.redirect('/admin/ecapsule-video');
        }
        await video.remove();
        return res.redirect('/admin/ecapsule-video');
    } catch (err) {
        next(err);
    }
}