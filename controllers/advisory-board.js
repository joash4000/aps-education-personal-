const Board = require('../modals/AdvisoryBoard');
const fileHelper = require('../util/file');

exports.getBoard = async(req, res, next) => {
    try {
        const members = await Board.find();
        res.render('advisory-board-list', { members });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getBoardCreate = (req, res, next) => {
    res.render('advisory-board-create', { errorMessage: null });
}

exports.postBoardCreate = async(req, res, next) => {
    try {
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/advisory-board');
        }
        const { name, designation, about } = req.body;
        let photoUrl;
        if (req.files.photo) {
            photoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        const newMember = new Board({ name, designation, about, photoUrl });
        await newMember.save();
        res.redirect('/admin/advisory-board');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getEditBoard = async(req, res, next) => {
    try {
        const id = req.params.id;
        const member = await Board.findById(id);
        res.render('advisory-board-edit', { member, errorMessage: null });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.postEditBoard = async(req, res, next) => {
    try {
        const { _id, name, designation, about } = req.body;
        const member = await Board.findById(_id);
        let photoUrl = member.photoUrl || " ";
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/advisory-board/');
        }
        if (req.files.photo) {
            await fileHelper.deleteFile(member.photoUrl);
            photoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        member.name = name;
        member.designation = designation;
        member.about = about;
        member.photoUrl = photoUrl;
        await member.save();
        res.redirect('/admin/advisory-board');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getDeleteBoard = async(req, res, next) => {
    try {
        const id = req.params.id;
        const member = await Board.findById(id);
        await member.remove();
        if (member.photoUrl) {
            await fileHelper.deleteFile(member.photoUrl);
        }
        res.redirect('/admin/advisory-board');
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}