const db = require('../components/db');
const bcrypt = require('bcrypt-nodejs');

const salt = bcrypt.genSaltSync(10);

module.exports = {
    auth: async (login, passwd) => {
        let user = (await db.query(`select user_id, password, role from users where login = $1 limit 1`, [login])).rows;

        if (user && (user = user[0]) && bcrypt.compareSync(passwd, user.password)) {
            delete user.password;
            return user;
        }

        return null;
    },

    getAll: async () => {
        let result = (await db.query(`select * from users where user_id > 0`)).rows;
        result = result.map(user => {
            delete user.password;
            return user;
        });
        return result;
    },

    getList: async () => {
        let result = (await db.query(`select user_id, name, interests from users where user_id > 0`)).rows;
        return result;
    },

    getById: async (user_id) => {
        let user = (await db.query(`select * from users where user_id = $1 limit 1`, [user_id])).rows[0];
        if (user) {
            delete user.password;
            return user;
        } else return null;
    },

    create: async (name, login, password, role = 1, interests = '') => {
        password = bcrypt.hashSync(password, salt);
        let res = await db.query(`
            insert into users (
                name,
                login,
                password,
                role,
                interests
            ) values (
                $1, $2, $3, $4, $5
            ) returning user_id
        `, [ name, login, password, role, interests ]);
        if (res.rows && res.rows[0] && (res = res.rows[0])) return res.user_id;
    },

    delete: async (user_id) => {
        await db.query(`delete from users where user_id = $1 and user_id > 0`, [user_id]);
    }
};
