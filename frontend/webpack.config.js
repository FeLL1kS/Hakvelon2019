module.exports = {
    context: __dirname,
    devtool: "source-map",
    entry: "./main.js",
    output: {
        path: __dirname + "/dist",
        filename: "app.js"
    },
    module: {
        rules: [{
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
        }, ],
    },
};