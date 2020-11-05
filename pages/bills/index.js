import React, { Component } from 'react';
import {Card,Message} from 'semantic-ui-react';
import {Link} from '../../routes.js';
import web3 from '../../Ethereum/web3.js';
import Bill from '../../Ethereum/bill.js';
import BillsCard from '../../components/billsComponents/BillsCard.js';
import Layout from '../../components/billsComponents/Layout.js';
import Election from '../../Ethereum/election.js';
class index extends Component{
    static async getInitialProps(){
        const accounts = await web3.eth.getAccounts();
        
        const election = Election();
        const contractAdd = await election.methods.billContract().call();
        const WP = await election.methods.winnigParty().call();
        let owner='';
        if(WP!=undefined)
            owner = WP.candidateAddress;

        const bill= Bill();
        const billCount = await bill.methods.billsCount().call();
        const bills = await Promise.all(
            Array(parseInt(billCount))            // need to modify this, create a variable in bill contract having billCount
                .fill()
                .map((element,index)=>{
                    return bill.methods.bills(index).call();
                })
        );
        return {accounts,owner,bill,bills,contractAdd};
    }
    rendering(){
        return (this.props.bills.map((aBill,index)=>{
            return <BillsCard key={index} id={index} billName={aBill.name} proposal={aBill.proposal}/>;
        }));
    }

    render(){
        return(
            <Layout>
                <Message visible>
                    <p>Owner's Address : {this.props.owner}</p>
                    <p>Contract's Address : {this.props.contractAdd}</p>
                </Message>
                {this.rendering()}
            </Layout>
        );
    }
}
export default index;