const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const adminController = require('../controllers/admin');
const registerationController = require('../controllers/registeration');
const collegeController = require('../controllers/college');
const courseController = require('../controllers/course');
const userController = require('../controllers/user');
const roleController = require('../controllers/roles');
const surveyController = require('../controllers/survey');
const boardOfGovernersController = require('../controllers/board-governers');
const advisoryBoardController = require('../controllers/advisory-board');
const coreFacultiesController = require('../controllers/core-faculties');
const newsController = require('../controllers/news');
const bannerImageController = require('../controllers/bannerImage');
const galleryImageController = require('../controllers/gallery-image');
const partnersController = require('../controllers/partners');
const scrollingNewsController = require('../controllers/scrolling-news');
const videoCapsuleController = require('../controllers/videoCapsule');
const hindiCapsuleController = require('../controllers/hindiCapsule');
const englishCapsuleController = require('../controllers/englishCapsule');

const userRegistrations = require('../modals/User-Registeration');
const Survey = require('../modals/Survey');
const User = require('../modals/User');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const isUser = require('../middleware/is-User');

router.get('/', isAuth, adminController.getDashboard);
router.get('/login', isUser, adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', isAuth, adminController.getLogout);

router.get('/registeration', isAuth, registerationController.getRegistration);
router.get('/registeration/create', isAuth, registerationController.getRegistrationCreate);
router.post('/registeration/create', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
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
    body('idType', 'Id Proof cannot be empty').trim().not().isEmpty()
], isAuth, registerationController.postRegisterationCreate);
router.get('/registeration/edit', isAuth, registerationController.getEditRegisteration);
router.get('/registeration/edit/:_id', isAuth, registerationController.getEditRegisterationId);
router.post('/registeration/edit', isAuth, registerationController.postEditRegisteration);
router.post('/registeration/edit/true', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return userRegistrations.findOne({ email: value })
            .then(userDoc => {
                if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
        return userRegistrations.findOne({ contact: value })
            .then(userDoc => {
                if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                    return Promise.reject('Contact no already exists');
                }
            })
    }), body('courses', "Courses cannot be empty.").not().isEmpty(),
    body('name', 'Name cannot be empty').trim().not().isEmpty(),
    body('fatherName', 'Father name cannot be empty').trim().not().isEmpty(),
    body('fatherOccupation', 'Father occupation cannot be empty').trim().not().isEmpty(),
    body('category').custom((value, { req }) => {
        if (value === 'NONE') {
            throw new Error('Category cannot be empty')
        }
        return true;
    }).trim(),
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
    body('idType', 'Id Proof cannot be empty').trim().not().isEmpty()
], isAuth, registerationController.postEditRegistrationTrue);
router.get('/registeration/delete/:_id', isAuth, registerationController.deleteRegisteration);
router.get('/registeration/csv', isAuth, registerationController.getCsv);
router.post('/registeration/filter', isAuth, registerationController.getFilter);

router.get('/course', isAuth, isAdmin, courseController.getCourses);
router.get('/course/create', isAuth, isAdmin, courseController.getCoursesCreate);
router.post('/course/create', [body('courseName', 'Invalid Name').not().isEmpty(), body('coursePrice', 'Invalid Price').not().isEmpty().isNumeric()], isAuth, isAdmin, courseController.postCourseCreate);
router.get('/course/edit', isAuth, isAdmin, courseController.getEditCourse);
router.post('/course/edit', isAuth, isAdmin, courseController.postEditCourse);
router.post('/course/edit/true', [body('courseName', 'Invalid Name').not().isEmpty(), body('coursePrice', 'Invalid Price').not().isEmpty().isNumeric()], isAuth, isAdmin, courseController.postEditCourseTrue);
router.get('/course/delete/:_id', isAuth, isAdmin, courseController.getDeleteCourse);
router.get('/course/csv', isAuth, isAdmin, courseController.getCsv);


router.get('/college', isAuth, isAdmin, collegeController.getCollege);
router.get('/college/create', isAuth, isAdmin, collegeController.getCollegeCreate);
router.post('/college/create', [body('collegeName', 'Invalid Name').trim().not().isEmpty()], isAuth, isAdmin, collegeController.postCollegeCreate);
router.get('/college/edit', isAuth, isAdmin, collegeController.getEditCollege);
router.post('/college/edit', isAuth, isAdmin, collegeController.postEditCollege);
router.post('/college/edit/true', [body('collegeName', 'Invalid Name').not().isEmpty()], isAuth, isAdmin, collegeController.postEditCollegeTrue);
router.get('/college/delete/:_id', isAuth, isAdmin, collegeController.getDeleteCollege);
router.get('/college/csv', isAuth, isAdmin, collegeController.getCsv);


router.get('/user', isAuth, isAdmin, userController.getUser);
router.get('/user/create', isAuth, isAdmin, userController.getUserCreate);
router.post('/user/create', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(),
    body('firstName', 'Invalid First Name').not().isEmpty().trim(),
    body('lastName', 'Invalid Last Name').not().isEmpty().trim(),
    body('role', 'Invalid role').not().isEmpty(),
    body('password', 'Minimum length for password is 6 and alphanumeric.').isLength({ min: 6 }).isAlphanumeric().trim()
], isAuth, isAdmin, userController.postUserCreate);
router.get('/user/edit', isAuth, isAdmin, userController.getEditUser);
router.post('/user/edit', isAuth, isAdmin, userController.postEditUser);
router.post('/user/edit/true', [body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(),
    body('firstName', 'Invalid First Name').not().isEmpty().trim(),
    body('lastName', 'Invalid Last Name').not().isEmpty().trim(),
    body('role', 'Invalid role').not().isEmpty(),
    body('password', 'Minimum length for password is 6 and alphanumeric.').isLength({ min: 6 }).isAlphanumeric().trim()
], isAuth, isAdmin, userController.postEditUserTrue);
router.get('/user/delete/:_id', isAuth, isAdmin, userController.getDeleteUser);
router.get('/user/csv', isAuth, isAdmin, userController.getCsv);


router.get('/role', isAuth, isAdmin, roleController.getAdmin);
router.get('/role/employee', isAuth, isAdmin, roleController.getEmployee);

router.get('/survey', isAuth, surveyController.getRegistration);
router.get('/survey/create', isAuth, surveyController.getSurveyCreate);
router.post('/survey/create', [body('name', 'Name cannot be empty').not().isEmpty(), body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return Survey.findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
    return Survey.findOne({ contact: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('Contact no already exists');
            }
        })
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty()], isAuth, surveyController.postCreateSurvey);
router.get('/survey/edit', isAuth, surveyController.getEditSurvey);
router.post('/survey/edit', isAuth, surveyController.postEditSurvey);
router.post('/survey/edit/true', [body('name', 'Name cannot be empty').not().isEmpty(), body('email').isEmail().withMessage('Please enter a valid email.').custom((value, { req }) => {
    return Survey.findOne({ email: value })
        .then(userDoc => {
            if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                return Promise.reject('Email already exists');
            }
        })
}).normalizeEmail(), body('contact', "Phone number should be 10 digits.").isNumeric().isLength({ min: 10, max: 10 }).custom((value, { req }) => {
    return Survey.findOne({ contact: value })
        .then(userDoc => {
            if (userDoc && userDoc._id.toString() !== req.body._id.toString()) {
                return Promise.reject('Contact no already exists');
            }
        })
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty()], isAuth, surveyController.postEditSurveyTrue);
router.get('/survey/delete/:_id', isAuth, surveyController.deleteSurvey);
router.get('/survey/csv', isAuth, surveyController.getCsv);
router.get('/survey/edit/:_id', isAuth, surveyController.getEditRegisterationId);
router.post('/survey/filter', isAuth, surveyController.getFilter);
router.post('/email', isAuth, isAdmin, adminController.sendEmail);

router.get('/board-of-governers', isAuth, isAdmin, boardOfGovernersController.getBoard);
router.get('/board-of-governers/create', isAuth, isAdmin, boardOfGovernersController.getBoardCreate);
router.post('/board-of-governers/create', isAuth, isAdmin, boardOfGovernersController.postBoardCreate);
router.get('/board-of-governers/edit/:id', isAuth, isAdmin, boardOfGovernersController.getEditBoard);
router.post('/board-of-governers/edit', isAuth, isAdmin, boardOfGovernersController.postEditBoard);
router.get('/board-of-governers/delete/:id', isAuth, isAdmin, boardOfGovernersController.getDeleteBoard);

router.get('/advisory-board', isAuth, isAdmin, advisoryBoardController.getBoard);
router.get('/advisory-board/create', isAuth, isAdmin, advisoryBoardController.getBoardCreate);
router.post('/advisory-board/create', isAuth, isAdmin, advisoryBoardController.postBoardCreate);
router.get('/advisory-board/edit/:id', isAuth, isAdmin, advisoryBoardController.getEditBoard);
router.post('/advisory-board/edit', isAuth, isAdmin, advisoryBoardController.postEditBoard);
router.get('/advisory-board/delete/:id', isAuth, isAdmin, advisoryBoardController.getDeleteBoard);

router.get('/core-faculties', isAuth, isAdmin, coreFacultiesController.getCoreFacilities);
router.get('/core-faculties/create', isAuth, isAdmin, coreFacultiesController.getCoreFacilitiesCreate);
router.post('/core-faculties/create', isAuth, isAdmin, coreFacultiesController.postCoreFacilitiesCreate);
router.get('/core-faculties/edit/:id', isAuth, isAdmin, coreFacultiesController.getEditCoreFacilities);
router.post('/core-faculties/edit', isAuth, isAdmin, coreFacultiesController.postEditCoreFacilities);
router.get('/core-faculties/delete/:id', isAuth, isAdmin, coreFacultiesController.getDeleteCoreFacilities);

router.get('/news', isAuth, isAdmin, newsController.getNews);
router.get('/news/create', isAuth, isAdmin, newsController.getNewsCreate);
router.post('/news/create', isAuth, isAdmin, newsController.postNewsCreate);
router.get('/news/edit/:id', isAuth, isAdmin, newsController.getEditNews);
router.post('/news/edit', isAuth, isAdmin, newsController.postEditNews);
router.get('/news/delete/:id', isAuth, isAdmin, newsController.getDeleteNews);

router.get('/banner-image', isAuth, isAdmin, bannerImageController.getBannerImage);
router.post('/banner-image/add', isAuth, isAdmin, bannerImageController.postBannerImageCreate);
router.get('/banner-image/delete/:id', isAuth, isAdmin, bannerImageController.getDeleteBannerImage);

router.get('/gallery', isAuth, isAdmin, galleryImageController.getGalleryImage);
router.post('/gallery/add', isAuth, isAdmin, galleryImageController.postGalleryImageCreate);
router.get('/gallery/delete/:id', isAuth, isAdmin, galleryImageController.getDeleteGalleryImage);

router.get('/partners', isAuth, isAdmin, partnersController.getPartners);
router.get('/partners/create', isAuth, isAdmin, partnersController.getPartnersCreate);
router.post('/partners/create', isAuth, isAdmin, partnersController.postPartnersCreate);
router.get('/partners/edit/:id', isAuth, isAdmin, partnersController.getEditPartners);
router.post('/partners/edit', isAuth, isAdmin, partnersController.postEditPartners);
router.get('/partners/delete/:id', isAuth, isAdmin, partnersController.getDeletePartners);

router.get('/scrolling-news', isAuth, isAdmin, scrollingNewsController.getScrollingNews);
router.post('/scrolling-news/add', isAuth, isAdmin, scrollingNewsController.postScrollingNewsCreate);
router.get('/scrolling-news/delete/:id', isAuth, isAdmin, scrollingNewsController.getDeleteScrollingNews);

router.get('/ecapsule-video', isAuth, isAdmin, videoCapsuleController.getVideoCapsule);
router.post('/ecapsule-video/add', isAuth, isAdmin, videoCapsuleController.postAddVideo);
router.get('/ecapsule-video/state', isAuth, isAdmin, videoCapsuleController.getChangeVideoCapsuleState);
router.get('/ecapsule-video/delete', isAuth, isAdmin, videoCapsuleController.getDeleteVideoCapsule);

router.get('/ecapsule-hindi', isAuth, isAdmin, hindiCapsuleController.getHindiCapsule);
router.post('/ecapsule-hindi/add', isAuth, isAdmin, hindiCapsuleController.postAddHindi);
router.get('/ecapsule-hindi/state', isAuth, isAdmin, hindiCapsuleController.getChangeHindiCapsuleState);

router.get('/ecapsule-english', isAuth, isAdmin, englishCapsuleController.getEnglishCapsule);
router.post('/ecapsule-english/add', isAuth, isAdmin, englishCapsuleController.postAddEnglish);
router.get('/ecapsule-english/state', isAuth, isAdmin, englishCapsuleController.getChangeEnglishCapsuleState);

exports.routes = router;