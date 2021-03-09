const axios = require("axios");

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/requests/:days(\\d+)?", function (req, res) {
        let days = parseInt(req.params.days || "7");
        let minutes = days * 1440;

        let startTime = new Date(Date.now() - (minutes * 60 * 1000));
        axios.post("https://api.cloudflare.com/client/v4/graphql/", {
            query: "{\n" +
                "  viewer {\n" +
                "    zones(filter: { zoneTag: \"" + config.cloudflare.zone + "\" }) {\n" +
                "      httpRequests1dGroups(\n" +
                "        orderBy: [date_ASC]\n" +
                "        limit: 1000\n" +
                `"        filter: { datetime_gt: \"${ startTime.getFullYear() }-${ startTime.getMonth() + 1 }-${ startTime.getDate() }\" }\n"` +
                "      ) {\n" +
                "        date: dimensions {\n" +
                "          date\n" +
                "        }\n" +
                "        sum {\n" +
                "          cachedRequests\n" +
                "          requests\n" +
                "        }\n" +
                "        uniq {\n" +
                "          uniques\n" +
                "        }\n" +
                "      }\n" +
                "    }\n" +
                "  }\n" +
                "}",
            variables: {}
        }, {
            headers: {
                "X-Auth-Email": config.cloudflare.email,
                "X-Auth-Key": config.cloudflare.key
            }
        }).then(response=>{
            let arr = response.data.data.viewer.zones[0].httpRequests1dGroups;

            let data = [];
            for(let entry of arr) {
                data.push({
                    time: entry.date.date,
                    timestamp: Date.parse(entry.date.date),
                    total: entry.sum.requests,
                    unique: entry.uniq.unique
                })
            }

            res.json(data);
        }).catch(err => {
            console.log(err);
            res.status(500);
        })
    });

    return router;
};
