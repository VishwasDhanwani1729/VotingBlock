import React, { Component } from 'react';
import {Message} from 'semantic-ui-react';
import Layout from '../components/Layout.js';
import web3 from '../Ethereum/web3.js';
import Election from '../Ethereum/election.js';
class index extends Component{
    static async getInitialProps(){
        const accounts = await web3.eth.getAccounts();
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        const stateValue=await election.methods.state().call();
        let resultDeclared=false;
        if(stateValue=='2'){ resultDeclared=true;
        }
        return {accounts,election,resultDeclared};
    }
    async winner(){
        const accounts = await web3.eth.getAccounts();
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        const winner = await election.methods.results().call({
            from:accounts[0]
        });
        return <p>{winner}</p>;
    }
    render(){
        console.log(this.props.resultDeclared);
        return(
            <Layout page="results">
               <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Results would be declared here.</Message.Item>
                        <Message.Item>Winnig party would receive the tokens.</Message.Item>
                    </Message.List>
                </Message>
                {(this.props.resultDeclared)? this.winner : <p>Not declared yet</p>}
            </Layout>
        );
    }
}
export default index;