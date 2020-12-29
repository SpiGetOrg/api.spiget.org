const axios = require("axios");

module.exports.getResource = function (id) {
    return axios.get("https://api.spigotmc.org/simple/0.1/index.php?action=getResource&id=" + id, {
        headers: {
            "User-Agent": "spiget"
        }
    }).then(response => {
        const s = response.data;
        const d = {};
        if (s.title) d.name = s.title;
        if (s.tag) d.tag = s.tag;
        if (s.stats) {
            if (s.stats.downloads) d.downloads = Number(s.stats.downloads);
        }
        if (s.premium) {
            if (s.premium.price) d.price = Number(s.premium.price);
            if (s.premium.currency) d.currency = s.premium.currency;
        }
        return d;
    })
};

module.exports.getLatestResourceVersion = function (id) {
    return axios.get("https://api.spigotmc.org/simple/0.1/index.php?action=getResource&id=" + id, {
        headers: {
            "User-Agent": "spiget"
        }
    }).then(response => {
        const s = response.data;
        const d = {};
        //TODO
        return d;
    })
};
