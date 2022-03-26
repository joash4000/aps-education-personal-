require('dotenv/config');
const path = require('path');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const csrf = require('csurf');
const flash = require('connect-flash');

const MongoDBStore = require('connect-mongodb-session')(session);

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const publicRoutes = require('./routes/public');
const mobileRoutes = require('./routes/mobile');
const errorController = require('./controllers/error');

const hindiCapsule = require('./modals/EcapsuleHindi');
const englishCapsule = require('./modals/EcapsuleEnglish');

const MONGODB_URI = `mongodb://${process.env.MONGODB_HOST_NAME}:${process.env.MONGODB_PORT}/${process.env.MONGODB_NAME}`;

const PORT = process.env.PORT || 3000;

const pathToImages = path.join(__dirname, './', 'images');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.access(pathToImages, function(err) {
            if (err && err.code === 'ENOENT') {
                fs.mkdir(pathToImages, function() {
                    cb(null, './images');
                });
            } else {
                cb(null, './images');
            }
        });
    },
    filename: (req, file, cb) => {
        cb(null, ((req.body.name) ? req.body.name : Math.random().toString(36).substring(3)) + (Math.random().toString(18).substring(3)) + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'image/webp'
    ) {
        cb(null, true);
    } else {
        req.validatesError = "Invalid";
        cb(null, false, new Error('Invalid'));
    }
};


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(
    multer({
        storage: fileStorage,
        fileFilter: fileFilter
    }).fields([{ name: 'document_idcard', maxCount: 1 },
        { name: 'tenth_marksheet', maxCount: 1 },
        { name: 'twelve_marksheet', maxCount: 1 },
        { name: 'graduation_document', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'aspiring', maxCount: 1 }
    ])
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(pathToImages));

app.use(cookieParser());

app.use(
    session({
        secret: 'Y**:4u23P!Z~45U6S_k23j8Q-3=+Cz8A_96+.*28DR5P9;%W;-;+22~5D.x-*4=T-j|h+*^|7*55P%-hanyrandomsecretkeytobeaddedhere',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);


app.use('/mobile', mobileRoutes.routes);
const csrfProtection = csrf();
app.use(csrfProtection);
app.use(flash());
app.use(async(req, res, next) => {
    try {
        const hindi = await hindiCapsule.find({ active: true }).sort({ updatedAt: -1 });
        const english = await englishCapsule.find({ active: true }).sort({ updatedAt: -1 });
        res.locals.csrfToken = req.csrfToken();
        res.locals.error_msg = req.flash('error_msg');
        res.locals.user_err = req.flash('user_err');
        res.locals.nameunique = (req.session.user) ? (req.session.user.firstName.toUpperCase() + ' ' + req.session.user.lastName.toUpperCase()) : undefined;
        res.locals.roleunique = (req.session.user) ? (req.session.user.role.toUpperCase()) : undefined;
        res.locals.hindiCapsule = hindi;
        res.locals.englishCapsule = english;
        next();
    } catch (err) {
        next(err);
    }
});
app.use(publicRoutes.routes);
app.use('/', userRoutes.routes);
app.use('/admin', adminRoutes.routes);
app.get('/500', errorController.get500);
app.use('/robots.txt', (req, res, next) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: \n\nSitemap: http://www.arrowachievers.com');
});
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error)
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    app.listen(PORT, () => {
        mongoose.set('debug', true);
        console.log('server is running on port ' + PORT);
    });
}).catch(err => { console.log(err) })