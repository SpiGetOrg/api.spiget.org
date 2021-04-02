const {Metrics, IntervalFlusher} = require("metrics-node");
const Sentry = require('@sentry/node');

let config = require("./config");

const metrics = new Metrics(config.metrics);
const flusher = new IntervalFlusher(metrics, 10000);
metrics.setFlusher(flusher);


const API_REQUESTS_METRIC = metrics.metric('spiget', 'api_requests');
const apiRequestsMiddleware = (req, res, next) => {
    res.on("finish", () => {
        try {
            const route = req.route;
            if (route) {
                const path = route["path"];
                if (path) {
                    API_REQUESTS_METRIC
                        .tag("server", config.server.name)
                        .tag("method", req.method)
                        .tag("path", path)
                        .tag("status", `${res.statusCode}`)
                        .inc();
                }
            }
        } catch (e) {
            Sentry.captureException(e);
        }
    })
    next();
}

module.exports = {
    metrics,
    API_REQUESTS_METRIC,
    apiRequestsMiddleware
}
