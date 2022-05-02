import lotteryContract from '../compile';
import ganache from 'ganache';
import Web3 from 'web3';

const web3 = new Web3(ganache.provider());

(async () => {
  let accounts = await web3.eth.getAccounts();

  let lottery = await new web3.eth.Contract(lotteryContract.abi)
    .deploy({ data: lotteryContract.bytecode })
    .send({ from: accounts[0], gas: 1000000 });

  console.log(lottery);
})();
