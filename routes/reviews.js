const util = require("../util");
const fs = require("fs");

const Review = require("../db/schemas/resourceReview").model;

module.exports = function (express, config) {
    let router = express.Router();

    router.get("/", function (req, res) {
        Review.paginate({}, util.paginateReq(req, util.reviewAllFields), function (err, reviews) {
            if (err) {
                return console.error(err);
            }
            reviews = util.paginateRes(reviews, res);
            res.json(util.forceArray(util.fixId(reviews)));
        });
    });

    router.get("/trends", function (req, res) {
        Review.find({}, "rating").read("secondaryPreferred").lean().exec(function (err, reviews) {
            if (err) {
                return console.error(err);
            }
            let data = {
                "total": reviews.length,
                "1": 0,
                "2": 0,
                "3": 0,
                "4": 0,
                "5": 0
            };
            for (let i = 0; i < reviews.length; i++) {
                let rating = Math.round(reviews[i].rating.average);
                data[rating]++;
            }

            res.json(data);
        });
    });

    router.get("/:review(\\d+)", function (req, res) {
        Review.findOne({_id: req.params.review}).select(util.selectFields(req, util.reviewAllFields)).read("secondaryPreferred").lean().exec(function (err, review) {
            if (err) {
                return console.error(err);
            }
            if (!review) {
                res.status(404).json({error: "review not found"})
                return;
            }
            res.json(util.fixId(review))
        })
    });



    return router;
};
