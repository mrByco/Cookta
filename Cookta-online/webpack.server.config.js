
module.exports = {
    rules: [
        { test: /\.js$/, use: ['remove-hashbag-loader'] }
    ],
    resolveLoader: {
        alias: {
            "remove-hashbag-loader": path.join(__dirname, "./loaders/remove-hashbag-loader")
        }
    }
}
