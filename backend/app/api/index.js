const express = require('express');
const multer = require('multer');
const router = express.Router();

const {
    ValidationError,
    AccessError
} = require('../class/Error');
const logger = require('../components/logger')('api');

const UPLOADS_PATH = require('path').resolve(__dirname + '/../../public/uploads');

const api = {
    user: require('./user'),
    word: require('./word'),
};

for (let model in api) {
    for (let method in api[model]) {
        const path = `/${model}/${method}`;
        const handler = api[model][method];

        router.post(path, async (req, res) => {
            try {
                let data = await handler(req.body, req.session.user);
                res.json({
                    success: true,
                    data
                });
            } catch (error) {
                if (error instanceof ValidationError) {
                    return res.json({
                        success: false,
                        error: 400,
                        message: error.message
                    });
                }
                if (error instanceof AccessError) {
                    return res.json({
                        success: false,
                        error: 403,
                        message: error.message
                    });
                }

                res.json({
                    success: false,
                    error: 500,
                    message: 'Server Error'
                });
                logger.error(path, error);
            }
        });
    }
}

router.post('/upload', multer({ dest: UPLOADS_PATH }).single("avatar"), (req, res) => {
    let user_id = req.body.user_id;
    if (!user_id || parseInt(user_id) !== user_id) return res.json({
        success: false,
        error: 400,
        message: error.message
    });

    fs.renameSync(UPLOADS_PATH + '/' + req.file.filename, UPLOADS_PATH + '/' + user_id + '.jpg');

    res.json({
        success: true,
        data: '/uploads/' + user_id + '.jpg'
    });
})


router.use((req, res) => {
    res.json({
        success: false,
        error: 404,
        message: 'Not found'
    });
});

module.exports = router;