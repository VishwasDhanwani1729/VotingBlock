const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3=require('web3');

const election = require('./build/Election.json');
//const bill = require('./build/Bill.json');

const provider=new HDWalletProvider(
    'nation diesel shine upgrade feed grit print lock valley leisure river pudding',
    'https://rinkeby.infura.io/v3/7e068491137448ec9a1afe9aca29fab4'
);

const web3=new Web3(provider);

// reason behind deploy func. is that the keywords async can't be used outside/without of a func.
const deploy = async ()=>{
    let accounts = await web3.eth.getAccounts();

    console.log("Account which is deploying is : "+accounts[0]);
    console.log(await web3.eth.getBalance(accounts[0]));
    
    const resultElection = await new web3.eth.Contract(JSON.parse(election.interface))
    .deploy({ data:'0x'+ election.bytecode , arguments:['College Election']})
    .send({ from: accounts[0],gas:'10000000',value:'1000000000000000000' });
    
    console.log("The Election contract is deployed to : "+resultElection.options.address);
    // deployed at : 0x9c6eA049cd48432BD3a0FaDBb9e0442C28a306af

  /*  const resultBill = await new web3.eth.Contract(JSON.parse(bill.interface))
    .deploy({data:'0x'+bill.bytecode})
    .send({from:accounts[0],gas:'1000000',value:'2000000'});
    console.log('The Bill contract is deployed to : '+resultBill.options.address);
    //deployed at : 0x5DEB8eCeBEC7edCD7C72A9FA7329Dc64d82Df11d
*/
};

deploy();