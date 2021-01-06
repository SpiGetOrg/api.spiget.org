let express = require('express');
let app = express();
let http = require('http');
let server = http.Server(app);
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
let bodyParser = require("body-parser");
let morgan = require('morgan');
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let path = require("path");
let fs = require("fs");
let rfs = require("rotating-file-stream");
let config = require("./config");
let util = require("./util")
let port = process.env.PORT || config.port || 3012;

Sentry.init({
    dsn: config.sentry.dsn,
    integrations: [
        new Sentry.Integrations.Http({tracing: true}),
        new Tracing.Integrations.Express({
            app: app
        })
    ],
    tracesSampleRate: 0.05,
    serverName: config.server.name
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Accept, Content-Type, Origin, Spiget-User-Agent");
        res.header("Access-Control-Request-Headers", "X-Requested-With, Accept, Content-Type, Origin");
        res.header("Access-Control-Expose-Headers", "Content-Type, Content-Length, Location, X-Api-Time, X-Api-Server, X-Page-Sort, X-Page-Order, X-Page-Size, X-Max-Page-Size, X-Page-Index, X-Page-Count");
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));

app.use(function (req, res, next) {
    req.realAddress = req.header("x-real-ip") || req.realAddress;
    res.header("X-Spiget-Server", config.server.name || "default");
    next();
});

app.use("/.well-known", express.static(".well-known"));

// var swStats = require('swagger-stats');
// app.use(swStats.getMiddleware(config.swagger));

// create a rotating write stream
let accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log'),
    compress: "gzip"
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))
morgan.token('remote-addr', function (req) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

// Pretty-Print JSON
app.set('json spaces', 2);

// mongoose.plugin(util.idPlugin);
mongoose.plugin(util.paginatePlugin);
require("./db/db")(mongoose, config);

app.get("/", function (req, res) {
    res.redirect("/v2");
});

app.get("/health.json", function (req, res) {
    res.json({"status": "I'm healthy, yay!"});
});

app.get("/v2", function (req, res) {
    res.redirect("/v2/status");
});

app.use("/v2/status", require("./routes/status")(express, config));
app.use("/v2/resources", require("./routes/resources")(express, config));
app.use("/v2/authors", require("./routes/authors")(express, config));
app.use("/v2/categories", require("./routes/categories")(express, config));
app.use("/v2/reviews", require("./routes/reviews")(express, config));
app.use("/v2/search", require("./routes/search")(express, config));
app.use("/v2/metrics", require("./routes/metrics")(express, config));
app.use("/v2/webhook", require("./routes/webhook")(express, config));

app.use(Sentry.Handlers.errorHandler());

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).json({
        error: "Unexpected Exception",
        msg: "Unexpected Exception. Please report this to https://github.com/SpiGetOrg/api.spiget.org/issues"
    })
})

function exitHandler(err) {
    if (err) {
        console.log("\n\n\n\n\n\n\n\n");
        console.log(err);
        console.log("\n\n\n");
    }
    process.exit();
}


server.listen(port, function () {
    console.log('listening on *:' + port);
});

process.on("exit", exitHandler);
process.on("SIGINT", exitHandler);
process.on("uncaughtException", exitHandler);
