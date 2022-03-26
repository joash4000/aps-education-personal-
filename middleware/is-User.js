const User = require('../modals/User');
const bcrypt = require('bcryptjs');
module.exports = (req, res, next) => {
    User.find()
        .then(r => {
            if (r.length <= 0) {
                bcrypt.hash('admin1', 12).then(d => {
                    const newUser = new User({
                        firstName: 'Admin',
                        lastName: 'Admin',
                        email: 'admin@aps.com',
                        password: d,
                        role: 'admin',
                        confirmedAt: Date.now()
                    });
                    newUser.save().then(a => {
                        next();
                    })
                });
            } else {
                next();
            }
        })
}