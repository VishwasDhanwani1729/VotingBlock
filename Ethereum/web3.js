import Web3 from 'web3';

let web3; 
if(typeof window !=='undefined' && typeof window.web3 !=='undefined'){
    //we are in the browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
}else{
    // we are on the server or user is not running metamask
    // in our case it is 1st one
    // so we would create our own provider
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/7e068491137448ec9a1afe9aca29fab4'
    );
    web3 = new Web3(provider);
    
}

export default web3;