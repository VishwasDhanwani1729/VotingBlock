const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3=require('web3');

const election = require('../Ethereum/build/Election.json');

const provider=new HDWalletProvider(
    'nation diesel shine upgrade feed grit print lock valley leisure river pudding',
    'https://rinkeby.infura.io/v3/c8f18dcff88b4eb69b9032f837fb5880'
);

const web3=new Web3(provider);

// reason behind deploy func. is that the keywords async can't be used outside/without of a func.
const deploy = async ()=>{
    let accounts = await web3.eth.getAccounts();

    console.log("Account which is deploying is : "+accounts[0]);
    console.log(await web3.eth.getBalance(accounts[0]));
    
    const result = await new web3.eth.Contract(JSON.parse(election.interface))
    .deploy({ data:'0x'+ election.bytecode , arguments:['College Election']})
    .send({ from: accounts[0],gas:'1000000' });
    
    console.log("The contract is deployed to : "+result.options.address);
    // deployed at : 0x9d57Fd0F923CCEe9eFd7f4715C64f99a4b877E1A
};

deploy();