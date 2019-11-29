const readlineSync = require('readline-sync');
const User = require('../backend/app/models/User');
const db = require('../backend/app/components/db');

let login = process.argv[2] || false;
let name = process.argv[3] || false;
let role = process.argv[4] || 1;

if (!name) name = readlineSync.question('Name: ');
if (!login) login = readlineSync.question('Login: ');

let password = readlineSync.question('Password: ', {
    hideEchoBack: true
});

(async () => {
    console.log(await User.create(name, login, password, role));
    db.end();
})();
