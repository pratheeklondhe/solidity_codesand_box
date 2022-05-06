const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../builds/CampaignFactory.json');
const compiledCampaign = require('../builds/Campaign.json');

let campaign;
let accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();

	campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.abi))
		.deploy({ data: compiledFactory.evm.bytecode.object })
		.send({ from: accounts[0], gas: '10000000' });
	console.log(campaign);
});
