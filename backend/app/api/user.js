const {
    ValidationError
} = require('../class/Error');
const User = require('../models/User');

module.exports = {
    getAll() {

    },

    async getById({
        user_id
    }) {
        if (typeof user_id == 'number') throw new ValidationError('user_id');
        return User.getById();
    }
};