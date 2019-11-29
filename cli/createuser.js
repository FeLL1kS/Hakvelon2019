const readlineSync = require('readline-sync');
const User = require('../backend/app/models/User');
const db = require('../backend/app/components/db');

let login = process.argv[2] || false;
let name = process.argv[3] || false;
let role = process.argv[4];
let interests = process.argv[5];

if (!name) name = readlineSync.question('Name: ');
if (!name) throw new Error('you should tell me users name!');

if (!login) login = readlineSync.question('Login: ');
if (!login) throw new Error('you should tell me users login!');

let password = readlineSync.question('Password: ', {
    hideEchoBack: true
});
if (!password) throw new Error('you should tell me users password!');

if (!role) role = readlineSync.question('[Role (1-10)](1 by default): ') || 1;
if (!interests) interests = readlineSync.question('[Interests]("" by default): ') || '';

(async () => {
    console.log(await User.create(name, login, password, role, interests));
    db.end();
})();
