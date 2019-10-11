const util = require("../util");
const fs = require("fs");

const Resource = require("../db/schemas/resource").model;
const ResourceReview = require("../db/schemas/resourceReview").model;
const ResourceUpdate = require("../db/schemas/resourceUpdate").model;
const ResourceVersion = require("../db/schemas/resourceVersion").model;
const Author = require("../db/schemas/author").model;
const UpdateRequest = require("../db/schemas/updateRequest").model;


module.exports = function (express, config) {
    let router = express.Router();

    // Resource List Routes

    router.get("/", function (req, res) {
        Resource.paginate({}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    router.get("/new", function (req, res) {
        Resource.paginate({"$where": "this.releaseDate == this.updateDate"}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    router.get("/recentUpdates", function (req, res) {
        let lastTime = util.timeInSeconds() - 7200;
        Resource.paginate({"$where": "this.updateDate > " + lastTime}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    router.get("/premium", function (req, res) {
        Resource.paginate({"premium": true}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    router.get("/free", function (req, res) {
        Resource.paginate({"premium": false}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    router.get("/for/:versions", function (req, res) {
        let method = req.query.method || "any";
        let versionArray = req.params.versions.split(",");


        let done = function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json({
                check: versionArray,
                method: method,
                match: util.forceArray(util.fixId(resources))
            });
        };
        if (method === "any") {
            Resource.paginate({"testedVersions": {"$exists": true, "$in": versionArray}}, util.paginateReq(req, ["id", "name", "testedVersions"]), done);
        } else if (method === "all") {
            Resource.paginate({"testedVersions": {"$exists": true, "$all": versionArray}}, util.paginateReq(req, ["id", "name", "testedVersions"]), done);
        } else {
            res.status(400).json({error: "Unknown method. Allowed: any, all"})
        }
    });


    // Individual Resource Routes


    router.get("/:resource(\\d+)", function (req, res) {
        Resource.findOne({_id: req.params.resource}).select(util.selectFields(req, util.resourceAllFields)).lean().exec(function (err, resource) {
            if (err) {
                return console.error(err);
            }
            if (!resource) {
                res.status(404).json({error: "resource not found"})
                return;
            }
            res.json(util.fixId(resource))
        })
    });

    router.get("/:resource(\\d+)/go", function (req, res) {
        Resource.findOne({_id: req.params.resource}).select("_id").lean().exec(function (err, resource) {
            if (err) {
                return console.error(err);
            }
            if (!resource) {
                res.status(404).json({error: "resource not found"})
                return;
            }
            res.redirect("https://spigotmc.org/resources/" + resource._id + "?ref=spiget");
        })
    });


    // Author

    router.get("/:resource(\\d+)/author", function (req, res) {
        Resource.findOne({_id: req.params.resource}, "_id author").lean().exec(function (err, resource) {
            if (err) {
                return console.error(err);
            }
            if (!resource) {
                res.status(404).json({error: "resource not found"})
                return;
            }
            Author.findOne({_id: resource.author.id}).lean().exec(function (err, author) {
                if (err) {
                    return console.error(err);
                }
                if (!author) {
                    res.status(404).json({error: "author not found"})
                    return;
                }
                res.json(util.fixId(author));
            })
        })
    });


    // Icon

    router.get("/:resource(\\d+)/icon/:type?", function (req, res) {
        Resource.findOne({_id: req.params.resource}, "_id icon").lean().exec(function (err, resource) {
            if (err) {
                return console.error(err);
            }
            if (!resource) {
                res.status(404).json({error: "resource not found"})
                return;
            }
            util.sendImage(res, resource, req.params.type, util.notFoundImg.data, util.notFoundImg.url);
        })
    });

    // Download

    router.get("/:resource(\\d+)/download", function (req, res) {
        Resource.findOne({_id: req.params.resource}, "_id name file").lean().exec(function (err, resource) {
            if (err) {
                return console.error(err);
            }
            if (!resource) {
                res.status(404).json({error: "resource not found"})
                return;
            }

            if (config.server.mode !== "master") {
                util.redirectToMaster(req, res, config);
                return;
            }

            let file = util.makeDownloadFile(config, String(resource._id), resource.file.type);
            if (!fs.existsSync(file)) {
                res.status(404).json({error: "file not found"})
                return;
            }

            let fileName = resource.name + "#" + resource._id + resource.file.type;
            res.download(file, fileName);
        })
    });

    // Reviews

    router.get("/:resource(\\d+)/reviews", function (req, res) {
        ResourceReview.paginate({"resource": req.params.resource}, util.paginateReq(req, util.reviewAllFields), function (err, reviews) {
            if (err) {
                return console.error(err);
            }
            reviews = util.paginateRes(reviews, res);
            res.json(util.forceArray(util.fixId(reviews)));
        });
    });

    // Updates

    router.get("/:resource(\\d+)/updates", function (req, res) {
        ResourceUpdate.paginate({"resource": req.params.resource}, util.paginateReq(req, util.updateAllFields), function (err, updates) {
            if (err) {
                return console.error(err);
            }
            updates = util.paginateRes(updates, res);
            res.json(util.forceArray(util.fixId(updates)));
        });
    });

    router.get("/:resource(\\d+)/updates/:update(\\d+|latest)", function (req, res) {
        if ("latest" === req.params.update) {
            ResourceUpdate.findOne({"resource": req.params.resource}).sort({"date": 1}).lean().exec(function (err, update) {
                if (err) {
                    return console.error(err);
                }
                if (!update) {
                    res.status(404).json({error: "update not found"})
                    return;
                }
                res.json(util.fixId(update));
            });
        } else {
            ResourceUpdate.findOne({"_id": req.params.update}).lean().exec(function (err, update) {
                if (err) {
                    return console.error(err);
                }
                if (!update) {
                    res.status(404).json({error: "update not found"})
                    return;
                }
                res.json(util.fixId(update));
            });
        }
    });

    // Versions

    router.get("/:resource(\\d+)/versions", function (req, res) {
        ResourceVersion.paginate({"resource": req.params.resource}, util.paginateReq(req, util.versionAllFields), function (err, versions) {
            if (err) {
                return console.error(err);
            }
            versions = util.paginateRes(versions, res);
            res.json(util.forceArray(util.fixId(versions)));
        });
    });

    router.get("/:resource(\\d+)/versions/:version(\\d+|latest)", function (req, res) {
        if ("latest" === req.params.version) {
            ResourceVersion.findOne({"resource": req.params.resource}).sort({"releaseDate": -1}).lean().exec(function (err, version) {
                if (err) {
                    return console.error(err);
                }
                if (!version) {
                    res.status(404).json({error: "version not found"})
                    return;
                }
                res.json(util.fixId(version));
            });
        } else {
            ResourceVersion.findOne({"_id": req.params.version}).lean().exec(function (err, version) {
                if (err) {
                    return console.error(err);
                }
                if (!version) {
                    res.status(404).json({error: "version not found"})
                    return;
                }
                res.json(util.fixId(version));
            });
        }
    });

    router.get("/:resource(\\d+)/versions/:version(\\d+|latest)/download", function (req, res) {
        if ("latest" === req.params.version) {
            ResourceVersion.findOne({"resource": req.params.resource}, "_id resource").sort({"releaseDate": -1}).lean().exec(function (err, version) {
                if (err) {
                    return console.error(err);
                }
                if (!version) {
                    res.status(404).json({error: "version not found"})
                    return;
                }
                res.redirect("https://spigotmc.org/resources/" + version.resource + "/download?version=" + version._id);
            });
        } else {
            ResourceVersion.findOne({"_id": req.params.version}, "_id resource").lean().exec(function (err, version) {
                if (err) {
                    return console.error(err);
                }
                if (!version) {
                    res.status(404).json({error: "version not found"})
                    return;
                }
                res.redirect("https://spigotmc.org/resources/" + version.resource + "/download?version=" + version._id);
            });
        }
    });

    router.post("/:resource(\\d+)/requestUpdate", function (req, res) {
        if (config.server.mode !== "master") {
            util.redirectToMaster(req, res, config);
            return;
        }

        UpdateRequest.findOne({requestedId: req.params.resource}, function (err, duplicate) {
            if (err) return console.log(err);
            if (duplicate) {
                res.status(400).json({error: "Duplicate Update Request"});
                return;
            }

            let request = new UpdateRequest({
                requestedId: req.params.resource,
                requested: Date.now(),
                versions: req.body.versions !== false,
                updates: req.body.updates !== false,
                reviews: req.body.updates !== false
            });
            request.save(function (err, saved) {
                if (err) return console.log(err);
                res.json({
                    msg: "Resource update requested",
                    resource: saved.requestedId,
                    versions: saved.versions,
                    updates: saved.updates,
                    reviews: saved.reviews
                })
            })
        })
    });

    return router;
};
