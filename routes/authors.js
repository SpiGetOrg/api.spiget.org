const util = require("../util");
const fs = require("fs");

const Author = require("../db/schemas/author").model;
const Resource = require("../db/schemas/resource").model;
const ResourceReview = require("../db/schemas/resourceReview").model;

module.exports = function (express, config) {
    let router = express.Router();


    // Author Listing

    router.get("/",function (req,res) {
        Author.paginate({}, util.paginateReq(req, util.authorAllFields), function (err, authors) {
            if (err) {
                return console.error(err);
            }
            authors = util.paginateRes(authors, res);
            res.json(util.forceArray(util.fixId(authors)));
        });
    });

    router.get("/recentUpdates", function (req, res) {
        let lastTime = util.timeInSeconds() - 7200;
        Author.paginate({"$where": "this.fetch.latest > " + lastTime}, util.paginateReq(req, util.authorAllFields), function (err, authors) {
            if (err) {
                return console.error(err);
            }
            authors = util.paginateRes(authors, res);
            res.json(util.forceArray(util.fixId(authors)));
        });
    });


    // Individual Authors


    router.get("/:author(\\d+)", function (req, res) {
        Author.findOne({_id: req.params.author}).select(util.selectFields(req,util.authorAllFields)).read("secondaryPreferred").lean().read("secondaryPreferred").exec(function (err, author) {
            if (err) {
                return console.error(err);
            }
            if (!author) {
                res.status(404).json({error: "author not found"})
                return;
            }
            res.json(util.fixId(author))
        })
    });

    router.get("/:author(\\d+)/go", function (req, res) {
        Author.findOne({_id: req.params.author}).select("_id").read("secondaryPreferred").lean().exec(function (err, author) {
            if (err) {
                return console.error(err);
            }
            if (!author) {
                res.status(404).json({error: "author not found"})
                return;
            }
            res.redirect("https://spigotmc.org/members/" + author._id + "?ref=spiget");
        })
    });


    // Avatar

    router.get("/:author(\\d+)/avatar/:type?", function (req, res) {
        Author.findOne({_id: req.params.author}, "_id icon").read("secondaryPreferred").lean().exec(function (err, author) {
            if (err) {
                return console.error(err);
            }
            if (!author) {
                res.status(404).json({error: "author not found"})
                return;
            }
            util.sendImage(res, author, req.params.type, util.notFoundImg.data, util.notFoundImg.url);
        })
    });



    // Reviews

    router.get("/:author(\\d+)/reviews", function (req, res) {
        ResourceReview.paginate({"author.id": req.params.author}, util.paginateReq(req, util.reviewAllFields), function (err, reviews) {
            if (err) {
                return console.error(err);
            }
            reviews = util.paginateRes(reviews, res);
            res.json(util.forceArray(util.fixId(reviews)));
        });
    });


    router.get("/:author(\\d+)/resources", function (req, res) {
        Resource.paginate({"author.id": req.params.author}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    return router;
};
