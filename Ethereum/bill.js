import web3 from './web3.js';
import Election from './build/Bill.json';

export default()=>{
    return new web3.eth.Contract(JSON.parse(Election.interface),
    '0x5DEB8eCeBEC7edCD7C72A9FA7329Dc64d82Df11d');
};