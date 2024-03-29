const Sentry = require('@sentry/node');

module.exports = function (mongoose, config) {

    if (config.mongo.useTunnel) {
        console.log("Establishing SSH Tunnel to " + config.mongo.tunnel.host + "...");
        require("tunnel-ssh")(config.mongo.tunnel, function (err, server) {
            if (err) {
                console.error(err);
                return;
            }
            connectMongo(mongoose, config);
        })
    } else {
        connectMongo(mongoose, config);
    }

};

function connectMongo(mongoose, config) {
    if (config.mongo.url) {
        console.log("Connecting to mongodb...");
        mongoose.connect(config.mongo.url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true});
    } else {
        console.log("Connecting to mongodb://" + ((config.mongo.user || "admin") + ":*****" + "@" + (config.mongo.address || "localhost") + ":" + (config.mongo.port || 27017) + "/" + (config.mongo.database || "database")));
        mongoose.connect("mongodb://" + ((config.mongo.user || "admin") + ":" + (config.mongo.pass || "admin") + "@" + (config.mongo.address || "localhost") + ":" + (config.mongo.port || 27017) + "/" + (config.mongo.database || "database")));
    }

    mongoose.Promise = Promise;

    mongoose.connection.on("error", err => {
        Sentry.captureException(err);
        console.warn(err);
        console.warn("Mongo connection error, restarting app");
        setTimeout(() => {
            process.exit(1);
        }, 10000);
    });
    mongoose.connection.on('disconnected', () => {
        console.warn("Mongo disconnected, restarting app");
        setTimeout(() => {
            process.exit(1);
        }, 10000);
    });

}
