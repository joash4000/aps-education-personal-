const { validationResult } = require('express-validator');

const Course = require('../modals/Courses');

exports.getCourses = async(req, res, next) => {
    try {
        const courses = await Course.find();
        res.render('course', { courses });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCoursesCreate = (req, res, next) => {
    res.render('course-create', { errorMessage: null });
}

exports.postCourseCreate = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('course-create', {
            errorMessage: errors.array()[0].msg
        });
    }
    try {
        const { courseName, coursePrice } = req.body;
        const newCourse = new Course({ courseName, coursePrice });
        const course = await newCourse.save();
        res.redirect('/admin/course');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditCourse = async(req, res, next) => {
    try {
        const courses = await Course.find();
        return res.render('course-edit', {
            courses,
            errorMessage: null
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditCourse = async(req, res, next) => {
    try {
        const course = await Course.findOne({ courseName: req.body.course });
        if (!course) {
            return res.render('course-edit', {
                errorMessage: "Invalid Course"
            })
        }
        res.render('course-edit-true', {
            errorMessage: null,
            course
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditCourseTrue = async(req, res, next) => {
    try {
        const { courseName, coursePrice, _id } = req.body;
        const course = await Course.findById(_id);
        course.courseName = courseName;
        course.coursePrice = coursePrice;
        await course.save();
        res.redirect('/admin/course');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getDeleteCourse = async(req, res, next) => {
    try {
        const _id = req.params._id;
        const course = await Course.findById(_id);
        await course.remove();
        res.redirect('/admin/course');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCsv = async(req, res, next) => {
    try {
        const registeration = await Course.find().select('-_id -__v').lean();
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