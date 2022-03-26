const { validationResult } = require('express-validator');

const College = require('../modals/College');

exports.getCollege = async(req, res, next) => {
    try {
        const colleges = await College.find();
        res.render('college', { colleges });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCollegeCreate = (req, res, next) => {
    res.render('college-create', { errorMessage: null });
}

exports.postCollegeCreate = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('college-create', {
            errorMessage: errors.array()[0].msg
        });
    }
    try {
        const { collegeName } = req.body;
        const newCollege = new College({ collegeName });
        const college = await newCollege.save();
        res.redirect('/admin/college');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditCollege = async(req, res, next) => {
    try {
        const colleges = await College.find();
        return res.render('college-edit', {
            colleges,
            errorMessage: null
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditCollege = async(req, res, next) => {
    try {
        const college = await College.findOne({ collegeName: req.body.college });
        if (!college) {
            return res.render('college-edit', {
                errorMessage: "Invalid college"
            })
        }
        res.render('college-edit-true', {
            errorMessage: null,
            college
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditCollegeTrue = async(req, res, next) => {
    try {
        const { collegeName, _id } = req.body;
        const college = await College.findById(_id);
        college.collegeName = collegeName;
        await college.save();
        res.redirect('/admin/college');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getDeleteCollege = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const college = await college.findById(_id);
        await college.remove();
        res.redirect('/admin/college');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCsv = async(req, res, next) => {
    try {
        const registeration = await College.find().select('-_id -__v').lean();
        const jsonexport = require('jsonexport');
        return jsonexport(registeration, function(err, csv) {
            if (err) throw err;
            res.setHeader('Content-disposition', 'attachment; filename=data.csv');
            res.set('Content-Type', 'text/csv');
            return res.status(200).send(csv);
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}