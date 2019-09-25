module.exports = {
    production: {
        db: process.env.MONGO_ATLAS_URL,
        port: 4000,
        SECRET_TOKEN: process.env.SECRET_TOKEN,
        SECRET_REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN
    },
    development: {
        db: process.env.MONGO_ATLAS_URL,
        port: process.env.PORT,
        SECRET_TOKEN: process.env.SECRET_TOKEN,
        SECRET_REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN
    }
}