const path = require("path");

module.exports.resourceListFields = [
    "_id",
    "name",
    "tag",
    "contributors",
    "likes",
    "file",
    "testedVersions",
    "sourceCodeLink",
    "donationLink",
    "supportedLanguages",
    "links",
    "version",
    "author",
    "category",
    "rating",
    "releaseDate",
    "updateDate",
    "downloads",
    "icon",
    "author",
    "premium",
    "existenceStatus",

    "hidden"
];
module.exports.resourceAllFields = [
    "_id",
    "name",
    "tag",
    "contributors",
    "external",
    "file",
    "description",
    "likes",
    "testedVersions",
    "sourceCodeLink",
    "donationLink",
    "supportedLanguages",
    "version",
    "versions",
    "updates",
    "links",
    "author",
    "category",
    "rating",
    "releaseDate",
    "updateDate",
    "downloads",
    "icon",
    "reviews",
    "premium",
    "price",
    "currency",
    "existenceStatus",

    "hidden"
];

module.exports.authorAllFields = [
    "_id",
    "name",
    "icon",
    "identities"
];

module.exports.reviewAllFields = [
    "_id",
    "author",
    "rating",
    "message",
    "version",
    "date",
    "resource"
];

module.exports.updateAllFields = [
    "_id",
    "title",
    "description",
    "date",
    "likes",
    "resource"
];

module.exports.versionAllFields = [
    "_id",
    "uuid",
    "downloads",
    "rating",
    "url",
    "name",
    "releaseDate",
    "resource"
];

module.exports.categoryAllFields = [
    "_id",
    "name"
];

module.exports.notFoundImg = {
    url: "https://spiget.org/img/not-found-256.png",
    data: "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"
};

module.exports.fixId = function (docs) {
    if (docs) {
        if (Array.isArray(docs)) {
            return docs.map(doc => {
                doc.id = doc._id;
                delete doc._id;
                return doc;
            });
        } else {
            docs.id = docs._id;
            delete docs._id;
        }
    }

    return docs;
};

module.exports.paginatePlugin = function () {
    let p = require("mongoose-paginate");
    p.paginate.options = {
        lean: true,
        leanWithId: false,
        sort: "_id"
    };
    return p;
}();

module.exports.paginateReq = function (req, defaultFields, other) {

    let fieldStr = selectFields(req, defaultFields);

    let sortParam = req.query.sort || "id";
    let sortSplit = sortParam.split(",");
    let sortObj = {};
    for (let i = 0; i < sortSplit.length; i++) {
        let sort = sortSplit[i];

        let sortMode = 1;
        if (sort.indexOf("-") === 0) {
            sortMode = -1;
            sort = sort.substr(1);
        } else if (sort.indexOf("+") === 0) {
            sortMode = 1;
            sort = sort.substr(1);
        }
        sort = sort.trim();

        if (sort === "id") sort = "_id";
        sortObj[sort] = sortMode;
    }

    return Object.assign({}, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.size) || 10,
        sort: sortObj,
        select: fieldStr
    }, other);
};


function selectFields(req, defaultFields) {
    let fieldParam = req.query.fields || (defaultFields || ["id"]).join(",");
    let fieldSplit = fieldParam.split(",");
    let allowedFields = [];
    for (let i = 0; i < fieldSplit.length; i++) {
        if (defaultFields.indexOf(fieldSplit[i]) !== -1) {
            allowedFields.push(fieldSplit[i]);
        }
    }
    return allowedFields.join(" ");
}

module.exports.selectFields = selectFields;

module.exports.paginateRes = function (paginated, res) {
    res.set({
        "X-Page-Size": paginated.limit,
        "X-Page-Index": paginated.page,
        "X-Page-Count": paginated.pages,
        "X-Total": paginated.total
    });
    if (paginated.total <= 0) {
        res.status(404);
    }

    return paginated.docs;
};

module.exports.sendImage = function (res, source, type, defaultData, defaultUrl) {
    if (type === "raw") {
        if (!source || !source.icon.data) {
            res.status(404).send(defaultData);
        } else {
            res.send(source.icon.data);
        }
    } else if (type === "go") {
        if (!source || !source.icon.url) {
            res.status(404).redirect(defaultUrl);
        } else {
            res.redirect("https://spigotmc.org/" + source.icon.url);
        }
    } else if (type === "url") {
        if (!source || !source.icon.url) {
            res.status(404).send(source.icon.url);
        } else {
            res.send("https://spigotmc.org/" + source.icon.url);
        }
    } else {
        res.set({
            "Content-Type": "image/jpeg"
        });
        if (!source || !source.icon.data) {
            res.status(404).end(new Buffer(defaultData, "base64"));
        } else {
            res.end(new Buffer(source.icon.data, "base64"));
        }
    }
};

module.exports.timeInSeconds = function () {
    return Date.now() / 1000;
};

module.exports.forceArray = function (obj) {
    return [].concat(obj || []);
};

module.exports.forceObject = function (arr) {
    if (Array.isArray(arr)) {
        return arr[0];
    }
    return arr;
};

module.exports.makeDownloadFile = function (config, resource, type = ".jar") {
    let root = config.resourceFileRoot;
    let split = resource.split("");
    split.pop();

    //// <root>/1/2/3/1234.jar
    return path.join(root, split.join("/"), resource + type);
};


module.exports.redirectToMaster = function (req,res, config) {
    if (config.server.masterHost && config.server.masterHost.length > 0) {
        let url = req.protocol+"://"+config.server.masterHost+req.originalUrl;
        console.log("Redirecting slave request to master:", url);
        res.redirect(307, url);
    }else{
        console.warn("Unable to redirect slave request to master, as no master host is configured");
    }
};
