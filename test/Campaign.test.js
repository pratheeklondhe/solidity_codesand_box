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

	await campaignFactory.methods.createCampaign(150).send({
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
});

describe('Campaign Tests', () => {
	it('should create campaign', () => {
		console.log('HGHGHGHG', Object.keys(campaign.methods));
		assert.ok(campaign);
	});

	it('should add Contributors', async () => {
		await campaign.methods.addContributors().send({
			from: accounts[1],
			value: web3.utils.toWei('2', 'ether'),
			gas: '10000000'
		});

		const contributorsCount = await campaign.methods.contributorsCount().call({
			from: accounts[0]
		});

		const isContributor = await campaign.methods
			.contributors(accounts[1])
			.call({
				from: accounts[0]
			});

		assert.equal(contributorsCount, 1);
		assert.equal(isContributor, true);

		await campaign.methods.raiseRequest('Test Request', '1', accounts[3]).send({
			from: accounts[0],
			gas: '10000000'
		});

		let request = await campaign.methods
			.requests(0)
			.call({ from: accounts[0] });

		assert.ok(request);
		assert.equal(request.isFinalized, false);

		await campaign.methods.vote(0).send({
			from: accounts[1],
			gas: '10000000'
		});

		request = await campaign.methods.requests(0).call({ from: accounts[0] });

		assert.equal(request.approvalCount, '1');

		const initialBalance = await web3.eth.getBalance(accounts[3]);

		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '10000000'
		});

		const finalBalance = await web3.eth.getBalance(accounts[3]);

		request = await campaign.methods.requests(0).call({ from: accounts[0] });

		assert.equal(request.isFinalized, true);
		assert(finalBalance > initialBalance);
	});
});
