require("dotenv").config();
const { ethers } = require("ethers");
const { ETHDAI, ETHDAICreateTX } = require("./utils/addresses");
const ETHDAIABI = require("./abis/VaultETHDAI.abi");

// gets start block and timestamp of block for contract
const contractDeployBlock = async (provider) => {
  const daiStartBlock = (await provider.getTransaction(ETHDAICreateTX))
    .blockNumber;

  const daiTimeStamp = (await provider.getBlock(daiStartBlock)).timestamp;

  const daiInfo = {
    startBlock: daiStartBlock,
    timestamp: daiTimeStamp,
  };

  const currentBlock = await provider.getBlockNumber();

  console.log(`Vault time deployed: ${daiTimeStamp}`);
  console.log(`Vault block deployed: ${daiStartBlock}`);
  console.log(`Current block is: ${currentBlock}\n`);

  return [daiInfo, currentBlock];
};

// query the blockchain for Borrow event that is emmitted from contract
const queryEvents = async (provider, fromLast) => {
  const [daiDeployData, currentBlock] = await contractDeployBlock(provider);
  const daiVault = new ethers.Contract(ETHDAI, ETHDAIABI, provider);

  const evtDaiBorrow = await daiVault.filters.Borrow();

  const daiBorrowEvents = await daiVault.queryFilter(
    evtDaiBorrow,
    fromLast ? fromLast : daiDeployData.startBlock
  );

  console.log(`# of events queried: ${daiBorrowEvents.length}\n`);

  return daiBorrowEvents.sort((a, b) => a.blockNumber - b.blockNumber);
};

// get events from blockchain and formats them to be added to db
const getEvents = async (provider, fromLast) => {
  const allEvents = await queryEvents(provider, fromLast);

  const eventsData = [];

  let tx = null;
  let currentType = null;
  let val = 0;
  for (let i = 0; i <= allEvents.length - 1; i++) {
    const e = allEvents[i];
    const event = e.event;
    const user = e.args.userAddrs;

    if (allEvents[i].address === ETHDAI) {
      tx = allEvents[i].transactionHash;
      const num = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
      );
      val = num;
      if (event === "Borrow") {
        currentType = "DD";
      }
    }

    const timestamp = (await provider.getBlock(allEvents[i].blockNumber))
      .timestamp;
    const blocknumber = allEvents[i].blockNumber;

    const eventPoint = {
      user,
      vault: "ETHDAI",
      type: event,
      value: val,
      blocknumber,
      timestamp,
    };

    eventsData.push(eventPoint);
  }
  return eventsData;
};

const main = async (fromLast) => {
  let provider;

  if (process.env.PROJECT_ID) {
    provider = new ethers.providers.InfuraProvider(
      "homestead",
      process.env.PROJECT_ID
    );
  }

  let events;
  if (provider) {
    try {
      console.log("scraper started\n");
      events = await getEvents(provider, fromLast);
      console.log(
        `# of events ready to be added to the db: ${events.length}\n`
      );
      console.log("scraper ended");
    } catch (err) {
      console.log("crash:");
      console.log(err);
    }
  } else {
    console.log("no provider");
  }
  return events;
};

module.exports = main;
