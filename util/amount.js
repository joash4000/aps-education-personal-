const Courses = require('../modals/Courses');

module.exports = async(course) => {
    const coursesFound = await Courses.find({ 'courseName': { $in: course } });
    let amount = 0;
    coursesFound.forEach(e => {
        amount += e.coursePrice;
    });
    return amount * 100;
};