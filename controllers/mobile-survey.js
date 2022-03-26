const { validationResult } = require('express-validator');

const Survey = require('../modals/Survey');
const imageConverter = require('../util/string-to-image');


exports.postCreateSurvey = async(req, res, next) => {
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
            dob,
            email,
            address,
            state,
            district,
            tehsil,
            pincode,
            contact,
            height,
            weight,
            bloodGroup,
            board10,
            year10,
            board12,
            year12,
            graduationYear,
            graduationUniversity,
            graduationCourse,
            coaching,
            forceMember,
            governmentMember,
            other,
        } = req.body;
        let studentPhotoUrl;
        if (req.body.studentPhotoUrl && req.body.studentPhotoUrl != '') {
            let p = req.body.studentPhotoUrl;
            studentPhotoUrl = req.body.name + Date.now().toString() + 'photo.jpg';
            let done = await imageConverter(p, studentPhotoUrl);
            if (done) {
                studentPhotoUrl = 'images/' + studentPhotoUrl;
            }
        }
        const newSurvey = new Survey({
            courses: courses,
            college: college,
            name: name,
            fatherName: fatherName,
            dob: dob,
            email: email,
            address: address,
            state: (state) ? state.toUpperCase() : "NONE",
            district: district,
            tehsil: tehsil,
            pincode: pincode,
            contact: contact,
            height: height,
            weight: weight,
            bloodGroup: (bloodGroup) ? bloodGroup.toUpperCase() : "NONE",
            board10: (board10) ? board10.toUpperCase() : "NONE",
            year10: year10,
            board12: (board12) ? board12.toUpperCase() : "NONE",
            year12: year12,
            graduationYear: graduationYear,
            graduationUniversity: graduationUniversity,
            graduationCourse: graduationCourse,
            coaching: coaching,
            forceMember: (forceMember) ? forceMember.toUpperCase() : "NO",
            governmentMember: (governmentMember) ? governmentMember.toUpperCase() : "NO",
            other: (other) ? other.toUpperCase() : "",
            studentPhotoUrl,
            mode: "Mobile"
        });
        const survey = await newSurvey.save();
        res.status(201).json({ message: 'Survey created', user: survey });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}