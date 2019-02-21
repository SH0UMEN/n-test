module.exports = {
    devServer: {
        proxy: {
            "/api/*": {
                target: "https://proxyfordevelopers.com",
                secure: false
            }
        }
    }
}