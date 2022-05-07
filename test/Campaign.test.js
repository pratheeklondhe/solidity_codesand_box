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

	let campaignFactory = await new web3.eth.Contract(compiledFactory.abi)
		.deploy({ data: compiledFactory.evm.bytecode.object })
		.send({ from: accounts[0], gas: '10000000' });

	await campaignFactory.methods.createCampaign(1).send({
		from: accounts[0],
		gas: '1000000'
	});

	const deployedCampaigns = await campaignFactory.methods
		.getDeployedCampaigns()
		.call({
			from: accounts[0],
			gas: '1000000'
		});

	campaign = await new web3.eth.Contract(
		compiledCampaign.abi,
		deployedCampaigns[0]
	);

	console.log(campaign);
});

describe('Campaign Tests', () => {
	it('should create', () => {
		assert.ok(campaign);
	});

	it('should create campaign', async () => {
		await campaign.methods.createCampaign(1).send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		});

		const deployedCampaigns = await campaign.methods
			.getDeployedCampaigns()
			.call({
				from: accounts[0]
			});

		assert.equal(deployedCampaigns.length, 1);
	});
});
