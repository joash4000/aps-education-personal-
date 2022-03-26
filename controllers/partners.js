const Partners = require('../modals/Partners');
const fileHelper = require('../util/file');

exports.getPartners = async(req, res, next) => {
    try {
        const partners = await Partners.find();
        res.render('partners-list', { partners });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getPartnersCreate = (req, res, next) => {
    res.render('partners-create', { errorMessage: null });
}

exports.postPartnersCreate = async(req, res, next) => {
    try {
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/partners');
        }
        const { name, type, link } = req.body;
        let photoUrl;
        if (req.files.photo) {
            photoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        const newMember = new Partners({ name, type, link, photoUrl });
        await newMember.save();
        res.redirect('/admin/partners');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getEditPartners = async(req, res, next) => {
    try {
        const id = req.params.id;
        const member = await Partners.findById(id);
        res.render('partners-edit', { member, errorMessage: null });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.postEditPartners = async(req, res, next) => {
    try {
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/partners');
        }
        const { _id, name, type, link } = req.body;
        const member = await Partners.findById(_id);
        let photoUrl = member.photoUrl || " ";
        if (req.files.photo) {
            await fileHelper.deleteFile(member.photoUrl);
            photoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        member.name = name;
        member.type = type;
        member.link = link;
        member.photoUrl = photoUrl;
        await member.save();
        res.redirect('/admin/partners');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getDeletePartners = async(req, res, next) => {
    try {
        const id = req.params.id;
        const member = await Partners.findById(id);
        await member.remove();
        if (member.photoUrl) {
            await fileHelper.deleteFile(member.photoUrl);
        }
        res.redirect('/admin/partners');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}