import React, { Component } from 'react';
import {Card} from 'semantic-ui-react';
import {Link} from '../../routes.js';
import web3 from '../../Ethereum/web3.js';
import Bill from '../../Ethereum/bill.js';
import BillsCard from '../../components/billsComponents/BillsCard.js';
import Layout from '../../components/billsComponents/Layout.js';
class index extends Component{
    static async getInitialProps(){
        const accounts = await web3.eth.getAccounts();
        const bill= Bill();
        const bills = await Promise.all(
            Array(3)            // need to modify this, create a variable in bill contract having billCount
                .fill()
                .map((element,index)=>{
                    return bill.methods.bills(index).call();
                })
        );
        return {accounts,bill,bills};
    }
    rendering(){
        return (this.props.bills.map((aBill,index)=>{
            return <BillsCard key={index} id={index} billName={aBill.name} proposal={aBill.proposal}/>;
        }));
    }
    renderCards(){
        const items =[ {
                header : "Bill Name",
                meta:"Time",
                description : (<Link route={`/bills/requests/0`}>
                <a>View Details</a>
                </Link>),
                fluid:true
            },
            {
                header : "Bill Name",
                meta:"Time",
                description : (<Link route={`/bills/requests/0`}>
                <a>View Details</a>
                </Link>),
                fluid:true
            },
        ];
        return <Card.Group items={items}/>
    }
    render(){
        return(
            <Layout>
                {this.rendering()}
            </Layout>
        );
    }
}
export default index;