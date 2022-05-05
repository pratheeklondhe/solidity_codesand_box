const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, '../builds');
const campaignPath = path.resolve(__dirname, '../contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

const input = {
	language: 'Solidity',
	sources: {
		'Campaign.sol': {
			content: source
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': ['*']
			}
		}
	}
};
fs.removeSync(buildPath);

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
	'Campaign.sol'
];

for (let contract in output) {
	console.log(Object.keys(output[contract]));
	fs.outputJsonSync(buildPath + '/' + contract + '.json', output[contract]);
}

console.log('Compiled and outputted to builds folder');
process.exit(0);
