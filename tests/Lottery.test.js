const assert = require("assert");
const ganache = require("ganache");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const { abi, bytecode } = require("../compile");

console.log(bytecode);
