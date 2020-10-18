import React, { Component } from 'react';
import {Message,Grid,Button,Icon} from 'semantic-ui-react';
import web3 from '../../Ethereum/web3.js';
import Bill from '../../Ethereum/bill.js';
import {Router} from '../../routes.js';
import Layout from '../../components/billsComponents/Layout.js';
class Request extends Component{
    static async getInitialProps(props){
        
        return {index : props.query.billIndex}
    }
    state={
        billName:'',
        description:'',
        time:'',
        index:this.props.index
    }
    async renderData(){
        const {index} = this.props;
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        const billData=await bill.methods.bills(index).call();
        this.setState({
            billName : billData.name,
            description:billData.proposal
        });
    }
    async vote(voteIndex){
        //0 - upVote | 1- downVote
        const {index} = this.props;
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        await bill.methods.voteBill(index,voteIndex).send({
            from:accounts[0]
        });
    }
    render(){
        console.log(this.props.index);
        this.renderData();
        return(
            <Layout>
                <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Voter can either up-vote or down-vote.</Message.Item>
                        <Message.Item>To pass a bill it must get 50% votes from public.</Message.Item>
                    </Message.List>
                </Message>
                <Grid columns={2} relaxed="very">
                    <Grid.Column width={10} textAlign="justified">
                        <b>{this.state.billName}</b>
                        <p>
                            {this.state.description}
                        </p>
                        <Icon size="big" name="time"/>
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="center" verticalAlign="middle">
                     
                        <Button positive onClick={()=>this.vote(0)}>Up-Vote <Icon name="chevron up"/> </Button>
                        <div style={{marginTop:20}}></div>
                        <Button negative onClick={()=>this.vote(1)}>Down-Vote <Icon name="chevron down"/></Button>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}
export default Request;