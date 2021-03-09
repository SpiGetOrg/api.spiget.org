const axios = require("axios");

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/requests/:days(\\d+)?", function (req, res) {
        let days = parseInt(req.params.days || "7");
        let minutes = days * 1440;

        let startTime = new Date(Date.now() - (minutes * 60 * 1000));
        let y = `${ startTime.getFullYear() }`;
        let m = `${ startTime.getMonth() + 1 }`;
        if (m.length < 2) {
            m = "0" + m;
        }
        let d = `${ startTime.getDate() }`;
        if (d.length < 2) {
            d = "0" + d;
        }
        axios.post("https://api.cloudflare.com/client/v4/graphql/", {
            query: '{' +
                '  viewer {' +
                `    zones(filter: { zoneTag: "${ config.cloudflare.zone }" }) {` +
                '      httpRequests1dGroups(' +
                '        orderBy: [date_ASC]' +
                '        limit: 1000' +
                `        filter: { date_gt: "${ y }-${ m }-${ d }" }` +
                '      ) {' +
                '        date: dimensions {' +
                '          date' +
                '        }' +
                '        sum {' +
                '          cachedRequests' +
                '          requests' +
                '        }' +
                '        uniq {' +
                '          uniques' +
                '        }' +
                '      }' +
                '    }' +
                '  }' +
                '}',
            variables: {}
        }, {
            headers: {
                "X-Auth-Email": config.cloudflare.email,
                "X-Auth-Key": config.cloudflare.key,
                "Content-Type": "application/json"
            }
        }).then(response => {
            let data = [];
            if (response.data.data) {
                let arr = response.data.data.viewer.zones[0].httpRequests1dGroups;

                for (let entry of arr) {
                    data.push({
                        time: entry.date.date,
                        timestamp: Date.parse(entry.date.date),
                        total: entry.sum.requests,
                        unique: entry.uniq.uniques
                    })
                }
            }

            res.json(data);
        }).catch(err => {
            console.log(err);
            res.status(500);
        });
    });

    return router;
};
