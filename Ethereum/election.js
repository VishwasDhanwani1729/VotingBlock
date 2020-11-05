import web3 from './web3.js';
import Election from './build/Election.json';

export default(address)=>{
    return new web3.eth.Contract(JSON.parse(Election.interface),
    '0x8E748bDD9b60B7B6632bC644D6c80033D62De413');
};