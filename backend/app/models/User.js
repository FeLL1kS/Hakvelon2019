const db = require('../components/db');
const bcrypt = require('bcrypt-nodejs');

const salt = bcrypt.genSaltSync(10);

module.exports = {
    auth: async (login, passwd) => {
        let res = (await db.query(`select user_id, password, role from users where login = $1 limit 1`, [login])).rows;

        if (res && (res = res[0]) && await bcrypt.compare(passwd, res.password)) return res.user_id;

        return false;
    },

    load: async (user_id) => {
        let result = (await db.query(`select user_id, name, role from users where user_id = $1 limit 1`, [user_id])).rows[0] || false;
        return result;
    },

    getAll: async () => {
        let result = (await db.query(`select * from users`)).rows;
        return result;
    },

    getById: async (user_id) => {
        let result = (await db.query(`select * from users`)).rows;
        return result[0] ? result[0] : null;
    },

    create: async (name, login, password, role = 1) => {
        password = bcrypt.hashSync(password, salt);
        let res = await db.query(`insert into users (name, login, password, role) values ($1, $2, $3, $4) returning user_id`, [name, login, password, role]);
        if (res.rows && res.rows[0] && (res = res.rows[0])) return res.user_id;
    }
};
