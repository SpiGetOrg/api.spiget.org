const util = require("../util");

const Author = require("../db/schemas/author").model;
const Resource = require("../db/schemas/resource").model;

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/resources/:query", function (req, res) {
        let field = req.query.field || "name";
        let searchFields = [
            "name",
            "tag"
        ];
        if (searchFields.indexOf(field) === -1) {
            res.status(400).json({error: "invalid field"})
            return;
        }

        let query = {};
        query[field] = {"$regex": new RegExp(req.params.query), "$options": "i"};

        Resource.paginate(query, util.paginateReq(req, util.resourceListFields), function (err, resources) {
            if (err) {
                return console.error(err);
            }
            resources = util.paginateRes(resources, res);
            res.json(util.forceArray(util.fixId(resources)));
        });
    });

    router.get("/authors/:query", function (req, res) {
        let field = req.query.field || "name";
        let searchFields = [
            "name"
        ];
        if (searchFields.indexOf(field) === -1) {
            res.status(400).json({error: "invalid field"})
            return;
        }

        let query = {};
        query[field] = {"$regex": new RegExp(req.params.query), "$options": "i"};

        Author.paginate(query, util.paginateReq(req, util.authorAllFields), function (err, authors) {
            if (err) {
                return console.error(err);
            }
            authors = util.paginateRes(authors, res);
            res.json(util.forceArray(util.fixId(authors)));
        });
    });

    return router;
};