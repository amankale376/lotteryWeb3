require('dotenv').config()
const Web3 = require('web3');
const web3 = new Web3('https://rpc-mumbai.maticvigil.com/')
const abi  = require('./abi.json');
const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(abi, contractAddress);
console.log(contract?.methods);

async function getContractBalance(){
  const bal  =  await contract.methods.getBalance().call();
  console.log(bal,'balance');
}

async function joinContest (publicKey, privateKey){
const txObject ={
  from: publicKey,
  gas: web3.utils.toHex("100000"),
  to: contractAddress,
  data: contract.methods.recievePayment().encodeABI(),
  value: web3.utils.toHex(web3.utils.toWei("0.1", "ether"))
}
 const createTransaction = await web3.eth.accounts.signTransaction(
    txObject,
    privateKey
  );
  const recipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(recipt);
}

async function main() {
  const bal = await web3.eth.getBalance(process.env.PLAYER_ONE_PUBLIC_KEY);
  console.log(bal,'bal');
    await getContractBalance();
    await joinContest(process.env.PLAYER_TWO_PUBLIC_KEY, process.env.PLAYER_ONE_PRIVATE_KEY);
    await getContractBalance();
    const bal2 = await web3.eth.getBalance(process.env.PLAYER_ONE_PUBLIC_KEY);
    console.log(bal2,'bal');
}

 main();

