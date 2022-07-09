const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'S€cr3tT0kenEg4m0&D1eu$',
        DATABASE: 'mongodb://localhost:27017/egamsgdb'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}