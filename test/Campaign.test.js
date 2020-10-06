const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../Ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../Ethereum/build/Campaign.json');
const events = require('events').EventEmitter.defaultMaxListeners = 0;  //was getting an exception after putting that line gone [VIDEO 139 COMMNETS]
let accounts;
let campaignAddress;
let factory;
let campaign;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
                    .deploy({data : compiledFactory.bytecode})
                    .send({from : accounts[0], gas:'1000000'});
    factory.setProvider(provider);

    await factory.methods.createCampaign('100').send({// don't know why we are passing minContribution as string
        from : accounts[0],
        gas : '1000000'
    });
    const add = await factory.methods.getDeployedCampaign().call();
    campaignAddress = add[0];

    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
    // deploying contract from a particular address

});

describe('Campaign',()=>{
    /*it('will deploy factory & campaign',()=>{
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
        assert.equal(campaignAddress,campaign.options.address);
    });
    it('make caller as the campaign manager',async()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(manager,accounts[0]);
    });
    it('allow people to contribute money and marks them contributor',async()=>{
        await campaign.methods.contribute().send({
            value : '200',
            from : accounts[1],
        });
        const result = await campaign.methods.approvers(accounts[1]).call();
        assert.equal(true,result);
    });
    it('requires a minimum contribution',async()=>{
        try{
            await campaign.methods.contribute().send({
                value : '80',
                from : accounts[1]
            });
            assert(false);  //will make sure it that this test fails
        }catch(err){
            assert(err)
        }
    });
    it('allows a manager to make a payment request',async()=>{
        await campaign.methods.createRequest('100',"request1", accounts[1]).send({
            from : accounts[0],
            gas:'1000000'
        });
        const request = await campaign.methods.requests("0").call();
        //console.log(request);
        assert.equal("request1",request.description);
    });*/
    it('processes request',async()=>{
        try{
            //account has contributed
            await campaign.methods.contribute().send({
                from: accounts[1],
                value:'100'
            });
            //checking it has contributed or not
            const isContributed =await campaign.methods.approvers(accounts[1]).call();
            assert(isContributed);
            console.log('1');
            //creating a request
            await campaign.methods.createRequest('100',"request1", accounts[2]).send({
                from : accounts[0],
                gas : '1000000'
            });
            const request =await campaign.methods.requests("0").call();
            assert.equal("request1",request.description);
            console.log('2');

            //approve request
            await campaign.methods.approveRequest('0').send({
                from : accounts[1],
                gas:'100000'
            });
            const request2 = await campaign.methods.requests("0").call();
            assert.equal(1,request2.approvalCount);
            console.log('3');

            //finalize request by manager
            const pBalance = await web3.eth.getBalance(accounts[2]);
            await campaign.methods.finalizeRequest('0').send({
                from : accounts[0],
                gas : '1000000'
            });
            const aBalance = await web3.eth.getBalance(accounts[2]);
            assert(aBalance > pBalance);
            console.log(4);
        }catch(err){
            console.log('err');
            assert(false);
        }
    });
});