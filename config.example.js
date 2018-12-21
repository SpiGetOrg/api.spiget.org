let config = {};

config.port = 3012;
config.server = {
    name: "default",
    mode: "master"
};

config.resourceFileRoot = "/home/spiget/resources/download/";

config.mongo = {
    user: "",
    pass: "",
    address: "localhost",
    port: 27017,
    database: "spiget"
};


module.exports = config;