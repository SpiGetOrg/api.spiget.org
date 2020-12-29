const util = require("./util");

// https://github.com/SpiGetOrg/SpigetData/blob/5ebc18a912729cbfc4464159d45475b23eb0ffcd/src/test/java/org/spiget/data/test/UuidTest.java#L16
const uuid1 = util.makeVersionUuid(18687, 49741, "1.8.6-SNAPSHOT", 5, new Date(1591726681000));
console.log(uuid1);

