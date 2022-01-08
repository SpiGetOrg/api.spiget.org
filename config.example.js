let config = {};

config.port = 3012;
config.server = {
    name: "default",
    mode: "master",
    masterHost: ""
};

config.resourceFileRoot = "/home/spiget/resources/download/";

config.mongo = {
    useTunnel: false,
    tunnel: {
        username: "mongo",
        host: "1.2.3.4",
        privateKey: require("fs").readFileSync("./id_rsa"),
        port: 22,
        dstPort: 27017
    },
    user: "",
    pass: "",
    address: "localhost",
    port: 27017,
    database: "spiget"
};

config.cloudflare = {
    zone: "",
    key: "",
    email: ""
};

config.swagger = {

};

config.puller = {
    endpoint: "/_git_webhook",
    secret: "",
    vars: {
        appName: "spiget"
    },
    logCommands: true
};

module.exports = config;
