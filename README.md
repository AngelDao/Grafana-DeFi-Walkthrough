# Grafana-DeFi-Walkthrough

Here are the [videos](https://www.youtube.com/playlist?list=PLPExzm-2_QwD9t-Yad09lpH_OEtDzpn7W) that go along with the readme.

# Installation

## Technologies:

- [Mongodb](https://www.mongodb.com)

- [Node.js](https://nodejs.org/en/)

- [Express.js](http://expressjs.com/en/starter/installing.html)

- [Grafana](https://grafana.com/docs/grafana/latest/installation/)

### Addtional

If on macOS use this command when needing to run grafana sever and make sure to set `cfg:default.paths.plugins` to whatever path your plugins are stored at, can vary mine did:

```
/opt/homebrew/opt/grafana/bin/grafana-server --config /opt/homebrew/etc/grafana/grafana.ini --homepath /opt/homebrew/opt/grafana/share/grafana --packaging=brew cfg:default.paths.logs=/opt/homebrew/var/log/grafana cfg:default.paths.data=/opt/homebrew/var/lib/grafana cfg:default.paths.plugins=/usr/local/var/lib/grafana/plugins
```

# Getting Data From Ethereum

## Video 2 changelog

- abis/ - VaultETHDAI.abi.js
  _You can think of like a skeleton or model that is passed to ethers.js, so ethers can know what methods, vars, **events**, etc... the contract has._
  <br />
- node_modules/\*
  <br />
- utils/ - addresses.js
  _These are the addresses needed for contract interaction and data collection_
  <br />
- .env
  _You will need to get a project ID from [Infura](https://infura.io/dashboard) and paste it in the file, the contents of the file should just be:_
  `PROJECT_ID=053ew34435345b4ca24cb22003894`
  **Value is an example and will not work need to get your own from Infura!**
  <br />
- package.json
  - _Should look like:_

```
{
	"name": "grafana",
	"version": "1.0.0",
	"main": "index.js",
	"license": "MIT",
	"dependencies": {
		"axios": "^0.21.1",
		"body-parser": "^1.19.0",
		"dotenv": "^10.0.0",
		"ethers": "^5.3.1",
		"express": "^4.17.1",
		"mongodb": "^3.6.9",
		"mongoose": "^5.12.14"
	}
}
```

- scraper.js - _Contains the logic for getting events and formatting events_
  <br />
- yarn.lock
  - _Will be generated after running_ `yarn`

# Storing Ethereum Data in MongoDB

## Video 3 changelog

- `scraper.js`
  _export _`main()`_ so_ `server.js` _can import it and call it once route hit_<br/>

- **db/**

  - `index.js`
    _connects to the local mongodb instance and exports all models_ <br/>
  - **models/**
    - `EventPoint.js`
      _db model to define the MongoDB Collection(in other databases this is usally called a table) EventPoint. Which stores individual points that make up the time series data_<br/>

- **services/**

  - **EventPoints/**
    - `addMany.js`
      _Checks that events are unique and only adds the ones that are_
    - `index.js`
      _imports all service files for more readable code, and code reusability_
    - `lastBlock.js`
      _fetches that last event added sorted by blocknumber and returns the events blocknumber so scraper is not fetching redundant data_

- `server.js`
  _creates enpoint for future Grafana use, is where the the db is initialized, and interactions instantiated _

# Showing Ethereum Data on Grafana

## Video 4 changelog

- **Configure Grafana**

  - **JSON plugins**
    _The plugin to install is [simpod-json-datasource](https://grafana.com/grafana/plugins/simpod-json-datasource/), you can install with this command:_ `grafana-cli plugins install simpod-json-datasource`

  - **Grafana Server**
    _Once plugin is installed start your server, if it is already started you will need to restart it. The command I ran for this is:_

  ```
  /opt/homebrew/opt/grafana/bin/grafana-server --config /opt/homebrew/etc/grafana/grafana.ini --homepath /opt/homebrew/opt/grafana/share/grafana --packaging=brew cfg:default.paths.logs=/opt/homebrew/var/log/grafana cfg:default.paths.data=/opt/homebrew/var/lib/grafana cfg:default.paths.plugins=/usr/local/var/lib/grafana/plugins
  ```

  - **Create/Configure Dashboard & Panel**
    _Once panel is created add JSON as a data source add this is the A query body: _`{"only":["ETHDAI-DEBT"]}`

- **services/**
  - **EventPoints/**
    - `formatGrafana.js`
      _Queries all events from the db and formats them to be compliant with [JSON plugin](https://grafana.com/grafana/plugins/simpod-json-datasource/) format._
- **utils/**

  - `dataFiller.js`
    _fills the data between now and the last point with points if necessary_

- `server.js`
  - _added_ `POST` _routes_ in compliance with plugin format
