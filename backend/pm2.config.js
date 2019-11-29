module.exports = {
    apps: [{
        name: "hakvelon2019/backend",
        cwd: __dirname,
        script: __dirname + "/main.js",
        watch: [
            "app"
        ],
        ignore_watch: [
            "log/*",
            "node_modules/*",
            "public/*",
            "package-lock.json",
            ".git/*",
            ".*"
        ],
    }]
};
