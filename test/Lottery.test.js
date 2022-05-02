const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require("../compile");

let lottery;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery Contract Test Suite", () => {
  it("deploys contract", () => {
    assert.ok(lottery);
  });

  it("allows one account to enroll", async () => {
    await lottery.methods.enroll().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether")
    });

    const players = await lottery.methods.getPlayer().call({
      from: accounts[0]
    });
    assert.eq(players.length);
  });
});
