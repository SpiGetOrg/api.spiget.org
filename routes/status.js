const Status = require("../db/schemas/status").model;
const Resource = require("../db/schemas/resource").model;
const Author = require("../db/schemas/author").model;
const Category = require("../db/schemas/category").model;
const ResourceUpdate = require("../db/schemas/resourceUpdate").model;
const ResourceVersion = require("../db/schemas/resourceVersion").model;
const ResourceReview = require("../db/schemas/resourceReview").model;

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/", function (req, res) {
        Status.find({}).lean().exec(function (err, statusData) {
            if (err) {
                return console.error(err);
            }
            let status = {};
            for (let i = 0; i < statusData.length; i++) {
                status[statusData[i].key] = statusData[i].value;
            }

            let countPromises = [
                Resource.count().exec(),
                Author.count().exec(),
                Category.count().exec(),
                ResourceUpdate.count().exec(),
                ResourceVersion.count().exec(),
                ResourceReview.count().exec()
            ];

            Promise.all(countPromises).then(counts=>{
                res.json({
                    status: {
                        server: {
                            name: config.server.name,
                            mode: config.server.mode
                        },
                        fetch: {
                            start: status["fetch.start"],
                            startString: new Date(status["fetch.start"]),
                            end: status["fetch.end"],
                            active: status["fetch.end"] === 0,
                            page: {
                                amount: status["fetch.page.amount"],
                                index: status["fetch.page.index"],
                                item: {
                                    index: status["fetch.page.item.index"],
                                    status: status["fetch.page.item.state"]
                                }
                            }
                        },
                        restFetch: {
                            start: status["fetch.rest.start"],
                            startString: new Date(status["fetch.rest.start"]),
                            end: status["fetch.rest.end"],
                            active: status["fetch.rest.end"] === 0,
                            n: {
                                num: status["fetch.rest.num"],
                                start: status["fetch.rest.n.start"],
                                end: status["fetch.rest.n.end"],
                                max: status["fetch.rest.item.max"],
                                index: status["fetch.rest.item"]
                            }
                        },
                        existence: {
                            start: status["existence.start"],
                            startString: new Date(status["existence.start"]),
                            end: status["existence.end"],
                            active: status["existence.end"] === 0,
                            document: {
                                amount: status["existence.document.amount"],
                                suspects: status["existence.document.suspects"],
                                index: status["existence.document.index"],
                                id: status["existence.document.id"]
                            }
                        }
                    },
                    stats:{
                        resources:counts[0],
                        authors:  counts[1],
                        categories: counts[2],
                        resource_updates:counts[3],
                        resource_versions:counts[4],
                        reviews: counts[5]
                    }
                })
            })
        });
    })

    return router;
};
