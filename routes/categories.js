const util = require("../util");
const fs = require("fs");

const Category = require("../db/schemas/category").model;
const Author = require("../db/schemas/author").model;
const Resource = require("../db/schemas/resource").model;

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/", function (req, res) {
        Category.paginate({}, util.paginateReq(req, util.categoryAllFields), function (err, categories) {
            if (err) {
                return console.error(err);
            }
            categories = util.paginateRes(categories, res);
            res.json(util.forceArray(util.fixId(categories)));
        });
    });

    router.get("/:category(\\d+)", function (req, res) {
        Category.findOne({_id: req.params.category}).select(util.categoryAllFields).lean().exec(function (err, category) {
            if (err) {
                return console.error(err);
            }
            if (!category) {
                res.status(404).json({error: "category not found"})
                return;
            }
            res.json(util.fixId(category))
        })
    });

    router.get("/:category(\\d+)/go", function (req, res) {
        Category.findOne({_id: req.params.category}).lean().exec(function (err, category) {
            if (err) {
                return console.error(err);
            }
            console.log(category)
            if (!category) {
                res.status(404).json({error: "category not found"})
                return;
            }
            res.redirect("https://spigotmc.org/resources/categories/" + category._id + "?ref=spiget");
        })
    });

    router.get("/:category(\\d+)/resources", function (req, res) {
        Resource.paginate({"category.id": req.params.category}, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    return router;
};