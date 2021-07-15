const express = require("express");
const scraper = require("./scraper");
const dataFiller = require("./utils/dataFiller");
const EPService = require("./services/EventPoints");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const app = express();

app.post("/query", jsonParser, async (req, res) => {
  const lastBlock = await EPService.lastBlock();
  console.log(lastBlock);
  const eventPoints = await scraper(lastBlock);
  await EPService.addMany(eventPoints);
  const metrics = await EPService.formatGrafana();
  res.send(dataFiller(metrics));
});

app.post("/search", jsonParser, async (req, res) => {
  console.log("search");
  res.send(["ETHDAI-DEBT"]);
});

app.get("/", async (req, res) => {
  res.send("working");
});

app.listen(4000, () => {
  console.log("server started");
});
