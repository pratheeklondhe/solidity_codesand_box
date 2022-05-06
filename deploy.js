const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider({
	mnemonic: {
		phrase:
			'fun device gentle try sauce risk effort sound net bone define chase'
	},
	providerOrUrl: 'https://rinkeby.infura.io/v3/0cf52fce48db492282b6d25ad739f828'
});
const web3 = new Web3(provider);

async function deploy() {
	try {
		const accounts = await web3.eth.getAccounts();

		const result = await new web3.eth.Contract(abi)
			.deploy({ data: bytecode })
			.send({ from: accounts[0], gas: '1000000' });

		console.log(result);
		console.log(result.options.address);
	} catch (err) {
		console.log(err);
	}
}
deploy();
