const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require("../compile");

(async () => {
  let accounts = await web3.eth.getAccounts();

  let lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  console.log(lottery);
})();
