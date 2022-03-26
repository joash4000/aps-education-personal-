const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    courses: {
        type: Array
    },
    college: {
        type: String,
    },
    name: {
        type: String
    },
    fatherName: {
        type: String,
        required: true
    },
    fatherOccupation: {
        type: String,
        required: true
    },
    dob: {
        type: Date
    },
    category: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    district: {
        type: String
    },
    pincode: {
        type: Number
    },
    contact: {
        type: Number,
        required: true,
        unique: true
    },
    whatsapp: {
        type: Number
    },
    maritalStatus: {
        type: String
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    paid: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    tenthBoard: {
        type: String
    },
    tenthYear: {
        type: String
    },
    tenthSubject: {
        type: String
    },
    tenthPercentage: {
        type: Number
    },
    twelveBoard: {
        type: String
    },
    twelveYear: {
        type: String
    },
    twelveSubject: {
        type: String
    },
    twelvePercentage: {
        type: Number
    },
    aspiringYear: {
        type: String
    },
    aspiringBoard: {
        type: String
    },
    aspiringSubject: {
        type: String
    },
    graduationUniversity: {
        type: String
    },
    graduationYear: {
        type: String
    },
    graduationSubject: {
        type: String
    },
    graduationPercentage: {
        type: Number
    },
    idType: {
        type: String
    },
    idProofUrl: {
        type: String
    },
    tenthMarksheetUrl: {
        type: String
    },
    twelveMarksheetUrl: {
        type: String
    },
    aspiringUrl: {
        type: String
    },
    universityDocumentUrl: {
        type: String
    },
    studentPhotoUrl: {
        type: String
    },
    mode: {
        type: String,
        default: "Web"
    },
    amount: {
        type: Number
    },
    order_id: {
        type: String,
    },
    paymentDate: {
        type: Date
    },
    razorpay_order_id: {
        type: String,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
    failedPayments: {
        type: Array
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User-Registration', userSchema);