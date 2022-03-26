const { validationResult } = require('express-validator');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const imageConverter = require('../util/string-to-image');

exports.getCollege = async(req, res, next) => {
    const colleges = await College.find();
    res.status(200).json({ colleges });
}

exports.getCourse = async(req, res, next) => {
    const courses = await Course.find();
    res.status(200).json({ courses });
}

exports.postRegisterationCreate = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        });
    }
    try {
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses]
        }
        const {
            college,
            name,
            fatherName,
            fatherOccupation,
            dob,
            category,
            email,
            address,
            state,
            district,
            pincode,
            contact,
            whatsapp,
            maritalStatus,
            height,
            weight,
            paid,
            bloodGroup,
            tenthBoard,
            tenthYear,
            tenthSubject,
            tenthPercentage,
            twelveBoard,
            twelveYear,
            twelveSubject,
            twelvePercentage,
            aspiringYear,
            aspiringBoard,
            aspiringSubject,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType
        } = req.body;
        let idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl,
            universityDocumentUrl,
            studentPhotoUrl,
            aspiringUrl;

        if (req.body.idProofUrl && req.body.idProofUrl != '') {
            let p = req.body.idProofUrl;
            let type = '.jpg';
            if (req.body.isPdfId.toString() === 'true') {
                type = '.pdf';
            }
            idProofUrl = req.body.name + Date.now().toString() + 'id' + type;
            let done = await imageConverter(p, idProofUrl);
            if (done) {
                idProofUrl = 'images/' + idProofUrl;
            }
        }
        if (req.body.tenthMarksheetUrl && req.body.tenthMarksheetUrl != '') {
            let p = req.body.tenthMarksheetUrl;
            let type = '.jpg';
            if (req.body.isPdf10.toString() === 'true') {
                type = '.pdf';
            }
            tenthMarksheetUrl = req.body.name + Date.now().toString() + 'ten' + type;
            let done = await imageConverter(p, tenthMarksheetUrl);
            if (done) {
                tenthMarksheetUrl = 'images/' + tenthMarksheetUrl;
            }
        }
        if (req.body.twelveMarksheetUrl && req.body.twelveMarksheetUrl != '') {
            let p = req.body.twelveMarksheetUrl;
            let type = '.jpg';
            if (req.body.isPdf12.toString() === 'true') {
                type = '.pdf';
            }
            twelveMarksheetUrl = req.body.name + Date.now().toString() + 'twelve' + type;
            let done = await imageConverter(p, twelveMarksheetUrl);
            if (done) {
                twelveMarksheetUrl = 'images/' + twelveMarksheetUrl;
            }
        }
        if (req.body.universityDocumentUrl && req.body.universityDocumentUrl != '') {
            let p = req.body.universityDocumentUrl;
            let type = '.jpg';
            if (req.body.isPdfUniversity.toString() === 'true') {
                type = '.pdf';
            }
            universityDocumentUrl = req.body.name + Date.now().toString() + 'university' + type;
            let done = await imageConverter(p, universityDocumentUrl);
            if (done) {
                universityDocumentUrl = 'images/' + universityDocumentUrl;
            }
        }
        if (req.body.studentPhotoUrl && req.body.studentPhotoUrl != '') {
            studentPhotoUrl = req.body.name + Date.now().toString() + 'photo.jpg';
            let done = await imageConverter(req.body.studentPhotoUrl, studentPhotoUrl);
            studentPhotoUrl = (done) ? 'images/' + studentPhotoUrl : "";
        }
        if (req.body.aspiringUrl && req.body.aspiringUrl != '') {
            let p = req.body.aspiringUrl;
            let type = '.jpg';
            if (req.body.isPdfAspiring.toString() === 'true') {
                type = '.pdf';
            }
            aspiringUrl = req.body.name + Date.now().toString() + 'aspiring' + type;
            let done = await imageConverter(p, aspiringUrl);
            if (done) {
                aspiringUrl = 'images/' + aspiringUrl;
            }
        }
        const newUser = new UserRegistration({
            courses: courses,
            college: college,
            name: name,
            fatherName: fatherName,
            fatherOccupation: fatherOccupation,
            dob: dob,
            category: (category) ? category.toUpperCase() : category,
            email: email,
            address: address,
            state: (state) ? state.toUpperCase() : state,
            district: district,
            pincode: pincode,
            contact: contact,
            whatsapp: whatsapp,
            maritalStatus: (maritalStatus) ? maritalStatus.toUpperCase() : maritalStatus,
            height: height,
            weight: weight,
            paid: (paid) ? paid.toUpperCase() : paid,
            bloodGroup: (bloodGroup) ? bloodGroup.toUpperCase() : bloodGroup,
            tenthBoard: (tenthBoard) ? tenthBoard.toUpperCase() : tenthBoard,
            tenthYear: tenthYear,
            tenthSubject: tenthSubject,
            tenthPercentage: tenthPercentage,
            twelveBoard: (twelveBoard) ? twelveBoard.toUpperCase() : twelveBoard,
            twelveYear: twelveYear,
            twelveSubject: twelveSubject,
            twelvePercentage: twelvePercentage,
            aspiringYear: aspiringYear,
            aspiringBoard: (aspiringBoard) ? aspiringBoard.toUpperCase() : aspiringBoard,
            aspiringSubject: aspiringSubject,
            graduationUniversity: graduationUniversity,
            graduationYear: graduationYear,
            graduationSubject: graduationSubject,
            graduationPercentage: graduationPercentage,
            idType,
            idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl: twelveMarksheetUrl,
            aspiringUrl,
            universityDocumentUrl,
            studentPhotoUrl,
            mode: "Mobile"
        });
        const user = await newUser.save();
        res.status(201).json({ message: "user created", user });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}