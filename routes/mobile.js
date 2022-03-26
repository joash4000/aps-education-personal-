const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const registerationController = require('../controllers/mobile-register');
const surveyController = require('../controllers/mobile-survey');
const userRegistrations = require('../modals/User-Registeration');
const Survey = require('../modals/Survey');


router.get('/college', registerationController.getCollege);

router.get('/courses', registerationController.getCourse);

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
}), body('name').isAlpha().withMessage('Enver Valid name'), body('fatherName').isAlpha().withMessage('Enver Valid father name')], registerationController.postRegisterationCreate);

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
}), body('height', 'Height cannot be empty').not().isEmpty(), body('weight', 'Weight cannot be empty').not().isEmpty()], surveyController.postCreateSurvey);

exports.routes = router;