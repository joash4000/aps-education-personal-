const CoreFacilities = require('../modals/CoreFaculties');
const fileHelper = require('../util/file');

exports.getCoreFacilities = async(req, res, next) => {
    try {
        const members = await CoreFacilities.find();
        res.render('core-faculties-list', { members });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getCoreFacilitiesCreate = (req, res, next) => {
    res.render('core-faculties-create', { errorMessage: null });
}

exports.postCoreFacilitiesCreate = async(req, res, next) => {
    try {
        const { name, role } = req.body;
        let photoUrl;
        if (req.files.photo) {
            photoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        const newMember = new CoreFacilities({ name, role, photoUrl });
        await newMember.save();
        res.redirect('/admin/core-faculties');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getEditCoreFacilities = async(req, res, next) => {
    try {
        const id = req.params.id;
        const member = await CoreFacilities.findById(id);
        res.render('core-faculties-edit', { member, errorMessage: null });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.postEditCoreFacilities = async(req, res, next) => {
    try {
        const { _id, name, role } = req.body;
        const member = await CoreFacilities.findById(_id);
        let photoUrl = member.photoUrl || " ";
        if (req.files.photo) {
            await fileHelper.deleteFile(member.photoUrl);
            photoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        member.name = name;
        member.role = role;
        member.photoUrl = photoUrl;
        await member.save();
        res.redirect('/admin/core-faculties');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getDeleteCoreFacilities = async(req, res, next) => {
    try {
        const id = req.params.id;
        const member = await CoreFacilities.findById(id);
        await member.remove();
        if (member.photoUrl) {
            await fileHelper.deleteFile(member.photoUrl);
        }
        res.redirect('/admin/core-faculties');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}