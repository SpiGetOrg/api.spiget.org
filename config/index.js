// Config is read from environment variables, see .env.example
// Note: a legacy ./config.js takes precedence over this file if it exists (node resolves config.js before config/index.js)
let env = process.env;
let config = {};

config.port = env.PORT || 3012;
config.server = {
    name: env.SERVER_NAME || "default",
    mode: env.SERVER_MODE || "master",
    masterHost: env.MASTER_HOST || ""
};

config.userAgent = env.USER_AGENT || "spiget";

config.mongo = {
    url: env.MONGO_URL,
    user: env.MONGO_USER,
    pass: env.MONGO_PASS,
    address: env.MONGO_HOST,
    port: env.MONGO_PORT,
    database: env.MONGO_DATABASE || "spiget"
};

config.sentry = {
    dsn: env.SENTRY_DSN
};

config.metrics = env.INFLUX_URL;

config.cloudflare = {
    zone: env.CLOUDFLARE_ZONE,
    key: env.CLOUDFLARE_KEY
};

module.exports = config;
