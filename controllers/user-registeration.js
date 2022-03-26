require('dotenv/config');
const { validationResult } = require('express-validator');
const Razorpay = require('razorpay');

const UserRegistration = require('../modals/User-Registeration');
const Course = require('../modals/Courses');
const College = require('../modals/College');
const fileHelper = require('../util/file');
const amountFinder = require('../util/amount');

// const instance = new Razorpay({
//     key_id: process.env.KEY_ID,
//     key_secret: process.env.KEY_SECRET,
// });

exports.getRegistrationCreate = async(req, res, next) => {
    try {
        const courses = await Course.find();
        res.render('public/registration-form', {
            errorMessage: null,
            courses: courses,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postRegisterationCreate = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        const courses = await Course.find();
        const colleges = await College.find();
        let idProofUrl,
            tenthMarksheetUrl,
            twelveMarksheetUrl,
            universityDocumentUrl,
            studentPhotoUrl,
            aspiringUrl;
        if (req.files.document_idcard) {
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.files.tenth_marksheet) {
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.twelve_marksheet) {
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.graduation_document) {
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.files.photo) {
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        if (req.files.aspiring) {
            aspiringUrl = req.files.aspiring[0].path.replace("\\", "/");
        }
        let courses1 = req.body.courses;
        if (!Array.isArray(courses1)) {
            courses1 = [courses1]
        }
        if (!errors.isEmpty()) {
            req.flash('error_msg', errors.array()[0].msg);
            req.flash('user_err', {...req.body, courses1 });
            await (idProofUrl) ? fileHelper.deleteFile(idProofUrl): '';
            await (tenthMarksheetUrl) ? fileHelper.deleteFile(tenthMarksheetUrl): '';
            await (twelveMarksheetUrl) ? fileHelper.deleteFile(twelveMarksheetUrl): '';
            await (universityDocumentUrl) ? fileHelper.deleteFile(universityDocumentUrl): '';
            await (aspiringUrl) ? fileHelper.deleteFile(aspiringUrl): '';
            await (studentPhotoUrl) ? fileHelper.deleteFile(studentPhotoUrl): '';
            return res.redirect('/registration-form');
        }
        if (req.validatesError) {
            await (idProofUrl) ? fileHelper.deleteFile(idProofUrl): '';
            await (tenthMarksheetUrl) ? fileHelper.deleteFile(tenthMarksheetUrl): '';
            await (twelveMarksheetUrl) ? fileHelper.deleteFile(twelveMarksheetUrl): '';
            await (universityDocumentUrl) ? fileHelper.deleteFile(universityDocumentUrl): '';
            await (aspiringUrl) ? fileHelper.deleteFile(aspiringUrl): '';
            await (studentPhotoUrl) ? fileHelper.deleteFile(studentPhotoUrl): '';
            req.flash('error_msg', "Invalid File Extension");
            return res.redirect('/registration-form');
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
        const newUser = new UserRegistration({
            courses: courses1,
            college: college,
            name: name,
            fatherName: fatherName,
            fatherOccupation: fatherOccupation,
            dob: dob,
            category: category,
            email: email,
            address: address,
            state: state,
            district: district,
            pincode: pincode,
            contact: contact,
            whatsapp: whatsapp,
            maritalStatus: maritalStatus,
            height: height,
            weight: weight,
            paid: paid,
            bloodGroup: bloodGroup,
            tenthBoard: tenthBoard,
            tenthYear: tenthYear,
            tenthSubject: tenthSubject,
            tenthPercentage: tenthPercentage,
            twelveBoard: twelveBoard,
            twelveYear: twelveYear,
            twelveSubject: twelveSubject,
            twelvePercentage: twelvePercentage,
            aspiringYear: aspiringYear,
            aspiringBoard: aspiringBoard,
            aspiringSubject: aspiringSubject,
            graduationUniversity: graduationUniversity,
            graduationYear: graduationYear,
            graduationSubject: graduationSubject,
            graduationPercentage: graduationPercentage,
            idType: idType,
            idProofUrl: idProofUrl,
            tenthMarksheetUrl: tenthMarksheetUrl,
            twelveMarksheetUrl: twelveMarksheetUrl,
            aspiringUrl: aspiringUrl,
            universityDocumentUrl: universityDocumentUrl,
            studentPhotoUrl: studentPhotoUrl
        });
        const user = await newUser.save();
        // const amount = await amountFinder(user.courses);
        // const orderIdGenerator = require('../util/order-no');
        // const order_id = await orderIdGenerator();
        // var options = {
        //     amount: amount,
        //     currency: "INR",
        //     receipt: order_id,
        //     payment_capture: '1'
        // };
        // const order = await instance.orders.create(options);
        req.flash('error_msg', "Registeration Successful");
        return res.redirect('/registration-form');
        // user.amount = amount / 100;
        // user.order_id = order_id;
        // await user.save();
        // res.render('pay', {
        //         key: process.env.KEY_ID,
        //         amount: order.amount,
        //         name: user.name,
        //         contact: user.contact,
        //         email: user.email,
        //         id: order.id,
        //         _id: user._id
        //     })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getEditRegisteration = (req, res, next) => {
    res.render('users/edit-reg', { errorMessage: null });
}

exports.postEditRegisteration = async(req, res, next) => {
    try {
        const { email, contact } = req.body;
        const user = await UserRegistration.findOne({ email: email, contact: contact });
        if (!user) {
            return res.render('users/edit-reg', { errorMessage: 'Invalid email or contact' });
        }
        const courses = await Course.find();
        const colleges = await College.find();
        res.render('users/edit-registeration', {
            errorMessage: null,
            user,
            courses,
            colleges
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postEditRegistrationTrue = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const user1 = await UserRegistration.findById(req.body._id);
            const courses = await Course.find();
            const colleges = await College.find();
            return res.status(422).render('users/edit-registeration', {
                errorMessage: errors.array()[0].msg,
                user: user1,
                courses,
                colleges
            });
        }
        let courses = req.body.courses;
        if (!Array.isArray(courses)) {
            courses = [courses]
        }
        const user = await UserRegistration.findById(req.body._id);
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
            aspiringUniversity,
            aspiringYear,
            aspiringSubject,
            aspiringPercentage,
            graduationUniversity,
            graduationYear,
            graduationSubject,
            graduationPercentage,
            idType,
        } = req.body;
        let idProofUrl = user.idProofUrl || " ",
            tenthMarksheetUrl = user.tenthMarksheetUrl || " ",
            twelveMarksheetUrl = user.twelveMarksheetUrl || " ",
            universityDocumentUrl = user.universityDocumentUrl || " ",
            studentPhotoUrl = user.studentPhotoUrl || " ",
            aspiringUrl = user.aspiringUrl || " ";

        if (req.files.document_idcard) {
            await fileHelper.deleteFile(user.idProofUrl);
            idProofUrl = req.files.document_idcard[0].path.replace("\\", "/");
        }
        if (req.files.tenth_marksheet) {
            await fileHelper.deleteFile(user.tenthMarksheetUrl);
            tenthMarksheetUrl = req.files.tenth_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.twelve_marksheet) {
            await fileHelper.deleteFile(twelveMarksheetUrl);
            twelveMarksheetUrl = req.files.twelve_marksheet[0].path.replace("\\", "/");
        }
        if (req.files.graduation_document) {
            await fileHelper.deleteFile(universityDocumentUrl);
            universityDocumentUrl = req.files.graduation_document[0].path.replace("\\", "/");
        }
        if (req.files.photo) {
            await fileHelper.deleteFile(studentPhotoUrl);
            studentPhotoUrl = req.files.photo[0].path.replace("\\", "/");
        }
        if (req.files.aspiring) {
            await fileHelper.deleteFile(aspiringUrl);
            aspiringUrl = req.files.aspiring[0].path.replace("\\", "/");
        }
        user.courses = courses;
        user.college = college;
        user.name = name;
        user.fatherName = fatherName;
        user.fatherOccupation = fatherOccupation;
        user.dob = dob;
        user.category = category;
        user.email = email;
        user.address = address;
        user.state = state;
        user.district = district;
        user.pincode = pincode;
        user.contact = contact;
        user.whatsapp = whatsapp;
        user.maritalStatus = maritalStatus;
        user.height = height;
        user.weight = weight;
        user.paid = paid;
        user.bloodGroup = bloodGroup;
        user.tenthBoard = tenthBoard;
        user.tenthYear = tenthYear;
        user.tenthSubject = tenthSubject;
        user.tenthPercentage = tenthPercentage;
        user.twelveBoard = twelveBoard;
        user.twelveYear = twelveYear;
        user.twelveSubject = twelveSubject;
        user.twelvePercentage = twelvePercentage;
        user.aspiringUniversity = aspiringUniversity;
        user.aspiringYear = aspiringYear;
        user.aspiringSubject = aspiringSubject;
        user.aspiringPercentage = aspiringPercentage;
        user.graduationUniversity = graduationUniversity;
        user.graduationYear = graduationYear;
        user.graduationSubject = graduationSubject;
        user.graduationPercentage = graduationPercentage;
        user.idType = idType;
        user.idProofUrl = idProofUrl;
        user.studentPhotoUrl = studentPhotoUrl;
        user.tenthMarksheetUrl = tenthMarksheetUrl;
        user.twelveMarksheetUrl = twelveMarksheetUrl;
        user.aspiringUrl = aspiringUrl;
        user.universityDocumentUrl = universityDocumentUrl;
        const savedUser = await user.save();
        res.redirect('/');
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.deleteRegisteration = async(req, res, next) => {
    try {
        const _id = req.params._id;
        if (_id) {
            const user = await UserRegistration.findById(_id);
            await fileHelper.deleteFile(user.idProofUrl);
            await fileHelper.deleteFile(user.studentPhotoUrlUrl);
            await fileHelper.deleteFile(user.tenthMarksheetUrl);
            await fileHelper.deleteFile(user.twelveMarksheetUrl);
            await fileHelper.deleteFile(user.universityDocumentUrl);
            await user.remove();
            res.redirect('/');
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getFind = async(req, res, next) => {
    const email = req.params.email;
    try {
        const user = await UserRegistration.findOne({ email: email });
        if (user) {
            res.status(200).json({ user: user });
        } else {
            res.status(200).json({ message: "Not found" })
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.postPaid = async(req, res, next) => {
    const colleges = await College.find();
    const courses = await Course.find();
    const crypto = require("crypto");
    const generatedSignature = crypto
        .createHmac(
            "SHA256",
            process.env.KEY_SECRET
        )
        .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
        .digest("hex");
    const isSignatureValid = generatedSignature === req.body.razorpay_signature;
    let errorMessage = "Payment Unsuccessful";
    const _id = req.body._id;
    let user = await UserRegistration.findById(_id);
    if (isSignatureValid) {
        user.razorpay_order_id = req.body.razorpay_order_id
        user.razorpay_payment_id = req.body.razorpay_payment_id;
        user.razorpay_signature = req.body.razorpay_signature;
        user.paymentDate = Date.now();
        user = await user.save();
        errorMessage = "Payment Successful"
        const mailer = require('../util/payment-mailer');
        mailer(user);
    } else {
        user.failedPayments.push({ amount: user.amount, order_id: user.order_id, date: Date.now() });
        user.amount = undefined;
        user.order_id = undefined;
        user = await user.save();
    }
    res.render('paid', {
        errorMessage: errorMessage,
        user
    });
}