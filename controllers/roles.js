const User = require('../modals/User');

exports.getAdmin = async(req, res, next) => {
    if (req.session.user.role === 'admin') {
        try {
            const page = +req.query.page || 1;
            let total = await User.countDocuments();
            let totalPages = Math.ceil(total / 10);
            const users = await User.find({ role: 'admin' });
            res.render('roles-admin', { users, totalPages, page, total });
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

exports.getEmployee = async(req, res, next) => {
    if (req.session.user.role === 'admin') {
        try {
            const page = +req.query.page || 1;
            let total = await User.countDocuments();
            let totalPages = Math.ceil(total / 10);
            const users = await User.find({ role: 'employee' });
            res.render('roles-employee', { users, totalPages, page, total });
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