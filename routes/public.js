require('dotenv/config');
const express = require('express');
const { body } = require('express-validator');


const router = express.Router();

const userRegistrations = require('../modals/User-Registeration');
const publicController = require('../controllers/public');
const registerationController = require('../controllers/user-registeration')

router.get('/', publicController.getBannerImage);

router.get('/about', (req, res) => {
    res.render('public/about');
});

router.get('/afcat', (req, res) => {
    res.render('public/afcat');
});

router.get('/cds', (req, res) => {
    res.render('public/cds');
});

router.get('/contact', (req, res) => {
    res.render('public/contact');
});

router.get('/course', (req, res) => {
    res.render('public/course');
});

router.get('/contact', (req, res) => {
    res.render('public/contact');
});

router.get('/cpo', (req, res) => {
    res.render('public/cpo');
});

router.get('/daring_skills', (req, res) => {
    res.render('public/daring_skills');
});

router.get('/director_message', (req, res) => {
    res.render('public/director_message');
});

router.get('/dps', (req, res) => {
    res.render('public/dps');
});

router.get('/faq', (req, res) => {
    res.render('public/faq');
});

router.get('/galleryPage', publicController.getGallery);

router.get('/it_skills', (req, res) => {
    res.render('public/it_skills');
});

router.get('/latest_news', publicController.getNews);

router.get('/latest-vacancies', (req, res) => {
    res.render('public/latest-vacancies');
});

router.get('/nda_old', (req, res) => {
    res.render('public/nda_old');
});

router.get('/nda', (req, res) => {
    res.render('public/nda');
});

router.get('/other_skills', (req, res) => {
    res.render('public/other_skills');
});

router.get('/our_facility', (req, res) => {
    res.render('public/our_facility');
});

router.get('/our_programs', (req, res) => {
    res.render('public/our_programs');
});

router.get('/our-strength', (req, res) => {
    res.render('public/our-strength');
});

router.get('/privacy_policy', (req, res) => {
    res.render('public/privacy_policy');
});

router.get('/soft_skills', (req, res) => {
    res.render('public/soft_skills');
});

router.get('/ssb', (req, res) => {
    res.render('public/ssb');
});

router.get('/terms_conditions', (req, res) => {
    res.render('public/terms_conditions');
});

router.get('/upcomming', (req, res) => {
    res.render('public/upcomming');
});

router.get('/vision-mission', (req, res) => {
    res.render('public/vision-mission');
});

router.get('/why_arrow', (req, res) => {
    res.render('public/why_arrow');
});

router.get('/advisory_board', publicController.getAdvisoryBoard);

router.get('/board_of_governors', publicController.getBoardOfGoverners);

router.get('/our_faculties', publicController.getCoreFaculties);

router.get('/skills_development', (req, res) => {
    res.render('public/skills_development');
});

router.get('/registration-form', registerationController.getRegistrationCreate);

router.post('/registration-form', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return userRegistrations.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
        return userRegistrations.findOne({ contact: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Contact no already exists');
                }
            })
    }),
    body('courses', "Courses cannot be empty.").not().isEmpty(),
    body('name', 'Name cannot be empty').trim().not().isEmpty(),
    body('fatherName', 'Father name cannot be empty').trim().not().isEmpty(),
    body('fatherOccupation', 'Father occupation cannot be empty').trim().not().isEmpty(),
    body('category').custom((value, { req }) => {
        if (value === 'NONE') {
            throw new Error('Category cannot be empty')
        }
        return true;
    }).trim(),
    body('dob', 'Date of birth cannot be empty').not().isEmpty().isDate(),
    body('bloodGroup').trim(),
    body('maritalStatus').custom((value, { req }) => {
        if (value === 'NONE') {
            throw new Error('Marital status cannot be empty')
        }
        return true;
    }).trim(),
    body('height', 'Invalid height').not().isEmpty().isNumeric(),
    body('weight', 'Invalid weight').not().isEmpty().isNumeric(),
    body('address', 'Address cannot be empty').not().isEmpty(),
    body('state').custom((value, { req }) => {
        if (value === 'NONE') {
            throw new Error('State cannot be empty')
        }
        return true;
    }).trim(),
    body('district', 'District cannot be empty').trim().not().isEmpty(),
    body('pincode', 'Invalid pincode').not().isEmpty().isNumeric().isLength({ max: 6, min: 6 }),
    body('idType', 'Id Proof cannot be empty').trim().not().isEmpty(),
], registerationController.postRegisterationCreate);

router.post('/contact', publicController.postContact);

router.post('/paid', registerationController.postPaid);

router.get('/sitemap.xml', (req, res, next) => {
    res.header('Content-Type', 'text/xml');
    res.render('sitemap');
});

router.get('/video', publicController.getVideoCapsule);

exports.routes = router;