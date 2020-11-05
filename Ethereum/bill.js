import web3 from './web3.js';
import Bill from './build/Bill.json';
export default()=>{
    return new web3.eth.Contract(JSON.parse(Bill.interface),
    '0x2d2A43B26d0B0e8d4d28D8929123C034bcd5fE32');
    //w-0x7b57b7e2900d84DD284cC8697C92c35C8C81a92a
    //o-0x2d2A43B26d0B0e8d4d28D8929123C034bcd5fE32
};