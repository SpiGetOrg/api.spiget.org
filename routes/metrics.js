const request = require("request");

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/requests/:days(\\d+)?", function (req, res) {
        let days = parseInt(req.params.days || "7");
        let minutes = days * 1440;

        request({
            url: "https://api.cloudflare.com/client/v4/zones/" + config.cloudflare.zone + "/analytics/dashboard?since=-" + Math.abs(minutes),
            headers: {
                "X-Auth-Email": config.cloudflare.email,
                "X-Auth-Key": config.cloudflare.key
            },
            json: true
        }, function (err, response, body) {
            if (err) return console.log(err);
            let timeArray = body.result.timeseries;

            let data = [];
            for (let i = 0; i < timeArray.length; i++) {
                let entry = timeArray[i];
                data.push({
                    time: entry.since,
                    timestamp: Date.parse(entry.since),
                    total: entry.requests.all,
                    unique: entry.uniques.all
                })
            }

            res.json(data);
        });
    });


    return router;
};