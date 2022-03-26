const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');
const moment = require('moment');
const jsonexport = require('jsonexport');

exports.getRegistration = async(req, res, next) => {
    try {
        const colleges = await College.find();
        const courses = await Course.find();
        const users = await Survey.find().sort({ createdAt: -1 });
        res.render('survey', { users, colleges, courses });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getSurveyCreate = async(req, res, next) => {
    try {
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('survey-create', {
            errorMessage: null,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postCreateSurvey = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array()[0].msg);
            return res.redirect('/admin/survey/create');
        }
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/survey/create');
        }
        let courses1 = req.body.courses;
        if (!Array.isArray(courses1)) {
            courses1 = [courses1]
        }
        const {
            college,
            name,
            fatherName,
            dob,
            email,
            address,
            state,
            district,
            tehsil,
            pincode,
            contact,
            height,
            weight,
            bloodGroup,
            board10,
            year10,
            board12,
            year12,
            graduationYear,
            graduationUniversity,
            graduationCourse,
            coaching,
            forceMember,
            governmentMember,
            other
        } = req.body;
        let studentPhotoUrl;
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        const newSurvey = new Survey({
            courses: courses1,
            college,
            name,
            fatherName,
            dob,
            email,
            address,
            state,
            district,
            tehsil,
            pincode,
            contact,
            height,
            weight,
            bloodGroup,
            board10,
            year10,
            board12,
            year12,
            graduationYear,
            graduationUniversity,
            graduationCourse,
            coaching,
            forceMember,
            governmentMember,
            other,
            studentPhotoUrl
        });
        await newSurvey.save();
        res.redirect('/admin/survey')
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditSurvey = (req, res, next) => {
    res.render('survey-edit', { errorMessage: null });
}

exports.postEditSurvey = async(req, res, next) => {
    try {
        const { email, contact } = req.body;
        let user;
        if (email != '') {
            user = await Survey.findOne({ email: email });
        }
        if (contact.toString().length === 10) {
            user = await Survey.findOne({ contact: contact });
        }
        if (!user) {
            return res.render('survey-edit', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('survey-edit-true', {
            errorMessage: null,
            user,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditSurveyTrue = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array()[0].msg);
            return res.redirect('/admin/survey');
        }
        if (req.validatesError) {
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/admin/survey');
        }
        let courses1 = req.body.courses;
        if (!Array.isArray(courses1)) {
            courses1 = [courses1];
        }
        const survey = await Survey.findById(req.body._id);
        const {
            college,
            name,
            fatherName,
            dob,
            email,
            address,
            state,
            district,
            tehsil,
            pincode,
            contact,
            height,
            weight,
            bloodGroup,
            board10,
            year10,
            board12,
            year12,
            graduationYear,
            graduationUniversity,
            graduationCourse,
            coaching,
            forceMember,
            governmentMember,
            other,
        } = req.body;
        let studentPhotoUrl = survey.studentPhotoUrl || " ";
        if (req.files.photo) {
            await fileHelper.deleteFile(survey.studentPhotoUrl);
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        survey.courses = courses1;
        survey.college = college;
        survey.name = name;
        survey.fatherName = fatherName;
        survey.dob = dob;
        survey.email = email;
        survey.address = address;
        survey.state = state;
        survey.district = district;
        survey.tehsil = tehsil;
        survey.pincode = pincode;
        survey.contact = contact;
        survey.height = height;
        survey.weight = weight;
        survey.bloodGroup = bloodGroup;
        survey.board10 = board10;
        survey.year10 = year10;
        survey.board12 = board12;
        survey.year12 = year12;
        survey.graduationYear = graduationYear;
        survey.graduationUniversity = graduationUniversity;
        survey.graduationCourse = graduationCourse;
        survey.coaching = coaching;
        survey.forceMember = forceMember;
        survey.governmentMember = governmentMember;
        survey.other = other;
        survey.studentPhotoUrl = studentPhotoUrl;
        const savedSurvey = await survey.save();
        res.redirect('/admin/survey');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteSurvey = async(req, res, next) => {
    try {
        const _id = req.params._id;
        if (_id) {
            const survey = await Survey.findById(_id);
            if (survey.studentPhotoUrl) {
                await fileHelper.deleteFile(survey.studentPhotoUrl);
            }
            await survey.remove();
            res.redirect('/admin/survey');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCsv = async(req, res, next) => {
    try {
        const registeration = await Survey.find().select('-_id -__v').lean();
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

exports.getEditRegisterationId = async(req, res, next) => {
    try {
        const user = await Survey.findById(req.params._id);
        if (!user) {
            return res.render('edit-reg', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('survey-edit-true', {
            errorMessage: null,
            user,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getFilter = async(req, res, next) => {
    try {
        let registeration;
        if (req.body.course) {
            registeration = await Survey.find({ courses: req.body.course }).select('-_id -__v').select('-_id -__v').lean();
        } else if (req.body.college) {
            registeration = await Survey.find({ college: req.body.college }).select('-_id -__v').select('-_id -__v').lean();
        } else if (req.body.sdate && req.body.edate) {
            registeration = await Survey.find({
                createdAt: {
                    $gte: moment(req.body.sdate).startOf('day').toDate(),
                    $lte: moment(req.body.edate).endOf('day').toDate()
                }
            }).select('-_id -__v').lean();
        } else {
            res.redirect('/admin/')
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('list', { users: registeration, courses, colleges });
        // return jsonexport(registeration, function(err, csv) {
        //     if (err) throw err;
        //     res.setHeader('Content-disposition', 'attachment; filename=data.csv');
        //     res.set('Content-Type', 'text/csv');
        //     return res.status(200).send(csv);
        // });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}