export default {
    port: 3000,
    mongodb: {
        uri: "mongodb://localhost/primum2",
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1
                }
            }
        }
    },
    "secret": "mySecretKey",
};