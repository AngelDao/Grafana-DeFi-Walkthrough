const { EventPoint } = require("../../db");

const isUnique = async (blocknumber, type, vault, timestamp) => {
  const points = await EventPoint.find({
    blocknumber,
    type,
    vault,
    timestamp,
  }).exec();
  if (points.length > 0) {
  }
  return points.length === 0;
};

const addMany = async (arr) => {
  let count = 0;
  for (let i = 0; i <= arr.length - 1; i++) {
    const event = arr[i];
    if (
      await isUnique(
        event.blocknumber,
        event.type,
        event.vault,
        event.timestamp
      )
    ) {
      await EventPoint.create(event);
      count++;
    } else {
    }
    console.log(`\n# of events queried: ${count}\n`);
  }
};

module.exports = { addMany };
