import React, { Component } from 'react';
import {Message,Form,Button} from 'semantic-ui-react';
import web3 from '../../Ethereum/web3.js';
import Bill from '../../Ethereum/bill.js';
import Layout from '../../components/billsComponents/Layout.js';
class Propose extends Component{
    state={
        billName:'',
        description:'',
        time:'',
        success:false,
        lodaing:false,
        errorMessage:''
    }
    sendProposal=async ()=>{
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        const {billName,description} = this.state;
        this.setState({ errorMessage:'',loading:true,success:false });
        try{
            await bill.methods.proposal(billName,description).send({
                from:accounts[0]
            });
            this.setState({success:true});
        }catch(err){
            this.setState({errorMessage:err.message});
        }
        this.setState({billName:'',
        description:'',
        time:'',
        success:false,
        lodaing:false,
        errorMessage:''});
    }
    render(){
        console.log(this.state.time);
        return(
            <Layout>
                <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Winning party can only propose a bill</Message.Item>
                        <Message.Item>To pass a bill it must get 50% votes from public</Message.Item>
                    </Message.List>
                </Message>
                <Message attached header="Bill details" />
                        <Form className="attached fluid segment" onSubmit={this.sendProposal} widths error={!!this.state.errorMessage} success={this.state.success}>
                            <Form.Field required>
                                <label>Bill Name</label>
                                <input  value={this.state.billName} onChange={event=>this.setState({billName:event.target.value})}/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Proposal</label>
                                <textarea value={this.state.description} onChange={event=>this.setState({description:event.target.value})}/>
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>Time</label>
                                <input type="datetime-local" value={this.state.time} onChange={event=>this.setState({time:event.target.value})}/>
                            </Form.Field>
                            <Message success header="Proposal Registered"/>
                            <Message error header="Oops...." content={this.state.errorMessage} />
                            <Button loading={this.state.loading} primary>Propose!</Button>
                        </Form>
            </Layout>
        );
    }
}
export default Propose;