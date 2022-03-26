const express = require('express');

const router = express.Router();

const surveyController = require('../controllers/user-survey');
const userContreller = require('../controllers/user-registeration');

router.get('/survey/delete/:_id', surveyController.deleteSurvey);
router.get('/survey/find/:email', surveyController.getFind);
router.get('/registeration/find/:email', userContreller.getFind);

exports.routes = router;