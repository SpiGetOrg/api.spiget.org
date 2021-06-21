const util = require("../util");
const Webhook = require("../db/schemas/webhook").model;
const crypto = require("crypto");

const VALID_EVENTS = ["new-resource", "resource-update", "new-author"];

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
        let url = req.body.url;
        let events = req.body.events;
        let salt = req.body.events || crypto.createHash("sha256").update(url + Date.now()).digest("hex");

        if (!url || url.length === 0 || !url.startsWith("http")) {
            res.status(400).json({error: "Missing/Invalid URL"});
            return;
        }
        if (!events || events.length === 0) {
            res.status(400).json({error: "Missing events"});
            return;
        }
        if (typeof events === "string") {
            events = JSON.parse(events);
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

        Webhook.findOne({url: url, events: events}, function (err, duplicate) {
            if (err) return console.log(err);
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
            webhook.save(function (err, saved) {
                if (err) return console.log(err);
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
        Webhook.findOne({_id: req.params.id}, "_id failStatus failedConnections", function (err, webhook) {
            if (err) return console.log(err);
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

        Webhook.findOne({_id: req.params.id}, function (err, webhook) {
            if (err) return console.log(err);
            if (!webhook) {
                res.status(404).json({error: "Webhook not found"});
                return;
            }
            if (webhook.secret !== req.params.secret) {
                res.status(403).json({error: "Invalid secret"});
                return;
            }

            Webhook.deleteOne({_id: req.params.id, secret: req.params.secret}, function (err, removed) {
                if (err) return console.log(err);
                res.json({success: true});
            })
        })
    });

    return router;
};
