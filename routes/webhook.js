const util = require("../util");
const Webhook = require("../db/schemas/webhook").model;
const crypto = require("crypto");

const VALID_EVENTS = ["new-resource", "resource-update", "new-author"];

function isHttpUrl(url) {
    if (typeof url !== "string") return false;
    try {
        let protocol = new URL(url).protocol;
        return protocol === "http:" || protocol === "https:";
    } catch (e) {
        return false;
    }
}

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/events", function (req, res) {
        res.json({
            events: VALID_EVENTS
        });
    });

    router.post("/register", function (req, res) {
        if (config.server.mode !== "master") {
            util.redirectToMaster(req, res, config);
            return;
        }
        let body = req.body || {};
        let url = body.url;
        let events = body.events;

        if (!isHttpUrl(url)) {
            res.status(400).json({error: "Missing/Invalid URL"});
            return;
        }
        let salt = body.events || crypto.createHash("sha256").update(url + Date.now()).digest("hex");
        if (!events || events.length === 0) {
            res.status(400).json({error: "Missing events"});
            return;
        }
        if (typeof events === "string") {
            try {
                events = JSON.parse(events);
            } catch (e) {
                res.status(400).json({error: "Invalid events"});
                return;
            }
        }
        if (!Array.isArray(events)) {
            res.status(400).json({error: "Invalid events"});
            return;
        }
        if(events.length === 0) {
            res.status(400).json({error: "Missing events"});
            return;
        }
        for (let i = 0; i < events.length; i++) {
            if (VALID_EVENTS.indexOf(events[i]) < 0) {
                res.status(400).json({error: "Unknown event: " + events[i]});
                return;
            }
        }

        util.asCallback(Webhook.findOne({url: url, events: events}).exec(), function (err, duplicate) {
            if (err) return util.serverError(res, err);
            if (duplicate) {
                res.status(400).json({error: "Duplicate Webhook"});
                return;
            }

            let id = crypto.createHash("sha256").update(url + Math.random() + Date.now()).digest("hex");
            let secret = crypto.createHash("sha512").update(url + Math.random() + JSON.stringify(events) + Date.now() + salt).digest("hex");
            let webhook = new Webhook({
                _id: id,
                url: url,
                events: events,
                secret: secret,
                createdAt: Date.now(),

                failedConnections: 0,
                failStatus: 0
            });
            util.asCallback(webhook.save(), function (err, saved) {
                if (err) return util.serverError(res, err);
                res.json({
                    id: saved.id,
                    url: saved.url,
                    events: saved.events,
                    secret: secret
                })
            })
        })
    });

    router.get("/status/:id", function (req, res) {
        util.asCallback(Webhook.findOne({_id: req.params.id}, "_id failStatus failedConnections").exec(), function (err, webhook) {
            if (err) return util.serverError(res, err);
            if (!webhook) {
                res.status(404).json({error: "Webhook not found"});
                return;
            }
            res.json({
                id: webhook.id,
                status: webhook.failStatus,
                failedConnections: webhook.failedConnections
            })
        })
    });

    router.delete("/delete/:id/:secret", function (req, res) {
        if (config.server.mode !== "master") {
            util.redirectToMaster(req, res, config);
            return;
        }

        util.asCallback(Webhook.findOne({_id: req.params.id}).exec(), function (err, webhook) {
            if (err) return util.serverError(res, err);
            if (!webhook) {
                res.status(404).json({error: "Webhook not found"});
                return;
            }
            if (webhook.secret !== req.params.secret) {
                res.status(403).json({error: "Invalid secret"});
                return;
            }

            util.asCallback(Webhook.deleteOne({_id: req.params.id, secret: req.params.secret}).exec(), function (err, removed) {
                if (err) return util.serverError(res, err);
                res.json({success: true});
            })
        })
    });

    return router;
};
