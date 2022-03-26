const shortid = require('shortid');
const User = require('../modals/User-Registeration');

async function order() {
    const order_id = 'APS' + (shortid.generate());
    const user = await User.find({ order_id: order_id });
    if (user.length > 0) {
        order();
    } else {
        return order_id.toUpperCase();
    }
}

module.exports = order;