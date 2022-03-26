const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../modals/User');

exports.getUser = async(req, res, next) => {
    try {
        if (req.session.user.role === 'admin') {
            const page = +req.query.page || 1;
            let total = await User.countDocuments();
            let totalPages = Math.ceil(total / 10);
            const users = await User.find();
            res.render('users', { users, totalPages, page, total });
        } else {
            res.redirect('/admin/')
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getUserCreate = (req, res, next) => {
    if (req.session.user.role === "admin") {
        res.render('user-create', { errorMessage: null });
    } else {
        res.redirect('/');
    }
}

exports.postUserCreate = async(req, res, next) => {
    if (req.session.user.role === "admin") {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('user-create', {
                errorMessage: errors.array()[0].msg
            });
        }
        try {
            const { firstName, lastName, email, password, role, confirmedAt } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = new User({ firstName: firstName, lastName: lastName, email: email, password: hashedPassword, role: role, confirmedAt: confirmedAt });
            const user = await newUser.save();
            res.redirect('/admin/user');
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    } else {
        res.redirect('/admin/');
    }

}

exports.getEditUser = async(req, res, next) => {
    if (req.session.user.role === 'admin') {
        try {
            return res.render('user-edit', {
                errorMessage: null
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    } else {
        res.redirect('/admin/');
    }
}

exports.postEditUser = async(req, res, next) => {
    if (req.session.user.role === 'admin') {
        try {
            const user = await User.findOne({ collegeName: req.body.college });
            if (!user) {
                return res.render('user-edit', {
                    errorMessage: "Invalid user"
                })
            }
            res.render('user-edit-true', {
                errorMessage: null,
                user
            });
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    } else {
        res.redirect('/admin/');
    }
}

exports.postEditUserTrue = async(req, res, next) => {
    if (req.session.user.role === 'admin') {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const user = await User.findById(req.body._id);
                return res.status(422).render('user-edit-true', {
                    errorMessage: errors.array()[0].msg,
                    user
                });
            }
            const { firstName, lastName, email, password, role, confirmedAt, _id } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.findById(_id);
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.password = hashedPassword;
            user.role = role;
            user.confirmedAt = confirmedAt;
            await user.save();
            res.redirect('/admin/user');
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    } else {
        res.redirect('/admin');
    }
}

exports.getDeleteUser = async(req, res, next) => {
    if (req.session.user.login === 'admin') {
        try {
            const _id = req.params._id;
            const user = await User.findById(_id);
            await user.remove();
            res.redirect('/admin/user');
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        }
    } else {
        res.redirect('/admin')
    }
}

exports.getCsv = async(req, res, next) => {
    if (req.session.user.role === 'admin') {
        try {
            const registeration = await User.find().lean();
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
    } else {
        res.redirect('/admin')
    }
}