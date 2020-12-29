const util = require("./util");

// https://github.com/SpiGetOrg/SpigetData/blob/5ebc18a912729cbfc4464159d45475b23eb0ffcd/src/test/java/org/spiget/data/test/UuidTest.java#L16
const uuid1 = util.makeVersionUuid(18687, 49741, "1.8.6-SNAPSHOT", 5, new Date(1591726681000));
console.log(uuid1);
console.assert("003a9c4f-0625-ae1a-0039-81dfd4c7cae9" === uuid1);

const uuid2 = util.makeVersionUuid(66275, 22621, "1.01", 1, new Date(1555253985000));
console.log(uuid2);
console.assert("0039a5a8-7621-7445-003b-32af47134c79" === uuid2)
