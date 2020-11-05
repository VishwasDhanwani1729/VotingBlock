import React, { Component } from 'react';
import {Grid,Message,Button,Card,Form,Input,Icon} from 'semantic-ui-react';
import web3 from '../../Ethereum/web3.js';
import Bill from '../../Ethereum/bill.js';
import Layout from '../../components/billsComponents/Layout.js';
import {Link,Router} from '../../routes.js';
class Transactions extends Component{
    state={
        balance:'0',
        errorMessage:'',
        successMessage:false,
        loading:false,
        transferTo:'',
        valueInEther:'',
        description:''
    } 
    static async getInitialProps(){
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        const transCount = parseInt(await bill.methods.transCount().call());
        console.log('=>>>'+transCount);
        let transactions;
        if(transCount!=0){
            transactions = await Promise.all(
                Array(transCount)
                .fill()
                .map((el,index)=>{
                    return bill.methods.transactions(index).call();
                })
            );
        }
        return {accounts,bill,transactions,transCount}
    }
    getBalance=async()=>{
        const bill = Bill();
        const balance = await bill.methods.getBalance().call();

        this.setState({balance:web3.utils.fromWei(balance,'ether')});
    }
    startTransaction=async()=>{
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        const {transferTo,valueInEther,description} = this.state;
        this.setState({ errorMessage:'',loading:true,successMessage:false });
        try{
            await bill.methods.sendTokens(transferTo,description,web3.utils.toWei(valueInEther,'ether')).send({
                from:accounts[0]
            });
            this.setState({successMessage:true});
        }catch(err){
            this.setState({errorMessage:err.message});
        }
        this.setState({loading:false});
        Router.replaceRoute(`/bills/requests/${this.props.index}`);
    }
    renderCards(){
        if(this.props.transCount==0)return;
        return(this.props.transactions.map((trans,index)=>{
            return <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            {trans.to}
                            <Link route={'https://rinkeby.etherscan.io/address/'+trans.to}>
                                <a><Icon name="location arrow"/></a>
                            </Link>
                        </Card.Header>
                        <Card.Meta>{trans.value+' wei'}</Card.Meta>
                        <Card.Description>
                            {trans.description}
                        </Card.Description>
                    </Card.Content>
                </Card>
            })
        );
    }
    render(){
        this.getBalance();
        return(
            <Layout>
                <Grid columns={2} relaxed="very" style={{marginTop:20}}>
                    <Grid.Column width={10} textAlign="justified">
                        {this.renderCards()}
                    </Grid.Column>
                    <Grid.Column width={6}verticalAlign="middle">
                        <Message info header={this.state.balance+' ether'} content="Contract Balance"/>
                        <Message attached header="Transfer Tokens" />
                        <Form className="attached fluid segment" onSubmit={this.startTransaction} error={!!this.state.errorMessage} success={this.state.successMessage}>
                            <Form.Field required>
                                <lable>To</lable>
                                <Input required value={this.state.transferTo} onChange={event=>this.setState({transferTo:event.target.value})}/>
                            </Form.Field>
                            <Form.Field required>
                                <lable>Description</lable>
                                <Input required value={this.state.description} onChange={event=>this.setState({description:event.target.value})}/>
                            </Form.Field>
                            <Form.Field required>
                                <lable>Value</lable>
                                <Input required label="ehter" labelPosition="right" value={this.state.valueInEther} onChange={event=>this.setState({valueInEther:event.target.value})}/>
                            </Form.Field>
                            <Form.Field>
                                <Message success header="Transaction Successful!"/>
                                <Message error header="Oops...." content={this.state.errorMessage} />
                                <Button primary loading={this.state.loading}>Transfer!</Button>
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}
export default Transactions;