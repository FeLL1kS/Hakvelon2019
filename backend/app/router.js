const express = require('express');
const api = require('./api/');
const User = require('./models/User');

const router = express.Router();

function generateToken(n) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

router.use('/auth', express.static(__dirname + '/../public/auth.html'));

router.post('/auth', async (req, res, next) => {
    if (req.body.login && req.body.passwd) {
        let user = await User.auth(req.body.login, req.body.passwd);
        if (user) {
            req.session.user = user;
            let token = generateToken(64);
            req.session.token = token;
            res.cookie('tkn', token);
            res.redirect(req.body.rpath ? req.body.rpath : '/');
        } else {
            next();
        }
    } else {
        next();
    }
});
router.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/auth');
});
router.use((req, res, next) => {
    if (!req.session.user || !req.session.token || !req.cookies.tkn || !(req.session.token == req.cookies.tkn)) {
        res.status(403).redirect('/auth?' + req.originalUrl);
    } else {
        next();
    }
});

// TODO: If you really want to use this, please add more security to /admin route, cause in this case user can open it typing /admin.html in url
router.use('/admin', (req, res, next) => {
    if (req.session.user.role == 1) {
        next();
    } else {
        res.sendFile(require('path').resolve(__dirname + '/../public/admin.html'));
    }
});

router.use('/api/', api);

router.use(express.static(__dirname + '/../public'));
router.use('/uploads', async (req, res) => {
    res.sendFile(require('path').resolve(__dirname + '/../public/uploads/0.png'));
});

router.use((req, res, next) => {
    res.redirect(301, '/#' + req.originalUrl);
});

module.exports = router;
