const { EventPoint } = require("../../db");

const formatGrafana = async () => {
  const events = await EventPoint.find({}).sort({ blocknumber: 1 });

  const arr = events;

  const response = [{ target: "ETHDAI-DEBT", datapoints: [] }];
  let currentDaiDebt = 0;

  arr.forEach((e) => {
    const event = e.type;
    const timestamp = e.timestamp * 1000;
    const num = e.value;

    if (!timestamp) console.log(e);
    if (e.vault === "ETHDAI") {
      if (event === "Borrow") {
        currentDaiDebt += num;
        response[0].datapoints.push([currentDaiDebt, timestamp]);
      }
    }
  });

  return response;
};

module.exports = { formatGrafana };
