module.exports = {
    apps: [{
        name: "hakvelon2019/backend",
        cwd: __dirname,
        script: __dirname + "/main.js",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
};
