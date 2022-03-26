require('dotenv/config');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const ejs = require('ejs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID.trim());

const User = require('../modals/User');
const UserRegisteration = require('../modals/User-Registeration');
const Courses = require('../modals/Courses');
const Colleges = require('../modals/College');
const Surveys = require('../modals/Survey');
const CoreFaculties = require('../modals/CoreFaculties');

exports.getDashboard = async(req, res, next) => {
    try {
        const registerations = await UserRegisteration.countDocuments();
        const courses = await Courses.countDocuments();
        const colleges = await Colleges.countDocuments();
        const surveys = await Surveys.countDocuments();
        const daysRegisteration = [{
                day: new Date().toISOString().substring(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(1, 'days').toISOString().substr(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(1, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(1, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            },
            {
                day: moment().subtract(2, 'day').toISOString().substr(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(2, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(2, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(3, 'days').toISOString().substr(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(3, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(3, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(4, 'days').toISOString().substr(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(4, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(4, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(5, 'days').toISOString().substr(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(5, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(5, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(6, 'days').toISOString().substr(0, 10),
                count: await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(6, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(6, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }
        ]
        const daysSurvey = [{
                day: new Date().toISOString().substring(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(1, 'days').toISOString().substr(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().subtract(1, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(1, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            },
            {
                day: moment().subtract(2, 'day').toISOString().substr(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().subtract(2, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(2, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(3, 'days').toISOString().substr(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().subtract(3, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(3, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(4, 'days').toISOString().substr(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().subtract(4, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(4, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(5, 'days').toISOString().substr(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().subtract(5, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(5, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }, {
                day: moment().subtract(6, 'days').toISOString().substr(0, 10),
                count: await Surveys.find({
                    createdAt: {
                        $gte: moment().subtract(6, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(6, 'days').endOf('day').toDate()
                    }
                }).countDocuments()
            }
        ];
        const user = await UserRegisteration.find({ amount: { $gt: 0 } });
        const payment = [{
                day: new Date().toISOString().substring(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().startOf('day').toDate(),
                        $lte: moment().endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            }, {
                day: moment().subtract(1, 'days').toISOString().substr(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(1, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(1, 'days').endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            },
            {
                day: moment().subtract(2, 'day').toISOString().substr(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(2, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(2, 'days').endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            }, {
                day: moment().subtract(3, 'days').toISOString().substr(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(3, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(3, 'days').endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            }, {
                day: moment().subtract(4, 'days').toISOString().substr(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(4, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(4, 'days').endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            }, {
                day: moment().subtract(5, 'days').toISOString().substr(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(5, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(5, 'days').endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            }, {
                day: moment().subtract(6, 'days').toISOString().substr(0, 10),
                count: totalSum(await UserRegisteration.find({
                    createdAt: {
                        $gte: moment().subtract(6, 'days').startOf('day').toDate(),
                        $lte: moment().subtract(6, 'days').endOf('day').toDate()
                    },
                    amount: { $gt: 0 }
                }))
            }
        ]
        let core = await CoreFaculties.find().countDocuments();
        let sum = totalSum(user);
        res.render('dashboard', { registerations, courses, core, colleges, surveys, reg: daysRegisteration, sur: daysSurvey, sum, payment });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getLogin = (req, res, next) => {
    res.render('login', { errorMessage: null });
}
exports.postLogin = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(422).render('login', {
                errorMessage: "Invalid email."
            });
        }
        const doMatch = await bcrypt.compare(password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            if (req.body.remember) {
                req.session.cookie.expires = 30 * 24 * 60 * 60 * 1000;
                req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
            }
            return req.session.save(err => {
                return res.redirect('/admin/');
            });
        }
        return res.status(422).render('login', {
            errorMessage: "Incorrect password."
        });
    } catch (err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    }
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/admin/login');
    });
};

exports.sendEmail = (req, res, next) => {
    let { emailto, subject, msg } = req.body;
    let mail = [];
    if (emailto.indexOf(',') !== -1) {
        mail = emailto.split(',');
    } else {
        mail.push(emailto);
    }
    ejs.renderFile(path.join(path.dirname(process.mainModule.filename), 'views', 'email', 'send.ejs'), { subject, msg }, function(err, data) {
        if (err) {
            throw new Error(err);
        } else {
            const mainOptions = {
                to: mail,
                from: process.env.EMAIL,
                subject: subject,
                html: data
            };
            sgMail.send(mainOptions)
                .then(sgData => {
                    console.log("Email Sent");
                }).catch(e => {
                    console.log(e.response.body);
                });
        }
    });
    res.redirect('/admin/')
}

const totalSum = (user) => {
    let sum = 0
    user.forEach(e => {
        sum += e.amount;
    });
    return sum;
}