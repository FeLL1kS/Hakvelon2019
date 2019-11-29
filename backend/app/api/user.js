const {
    ValidationError,
    AccessError
} = require('../class/Error');
const User = require('../models/User');

module.exports = {
    async getAll({}, {  // jshint ignore:line
        role
    }) {
        console.log(arguments);
        if (role == 1) throw new AccessError('user/getAll');
        return User.getAll();
    },

    async getList() {
        return User.getList();
    },

    async getById({
        user_id
    }) {
        if (!user_id || typeof user_id !== 'number') throw new ValidationError('user_id');
        return User.getById(user_id);
    },

    async create({
        name,
        login,
        password,
        role,
        interests
    }, user) {
        if (user.role == 1) throw new AccessError('user/create');
        if (!name || typeof name !== 'string' || name.trim() == '') throw new ValidationError('name');
        if (!login || typeof login !== 'string' || login.trim() == '') throw new ValidationError('login');
        if (!password || typeof password !== 'string' || password.trim() == '') throw new ValidationError('password');
        if (!role || typeof role !== 'number') throw new ValidationError('role');
        if (!interests || typeof interests !== 'string' || interests.trim() == '') throw new ValidationError('interests');

        return User.create(name, login, password, role, interests);
    }
};