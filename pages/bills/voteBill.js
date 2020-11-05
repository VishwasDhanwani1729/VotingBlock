import React, { Component } from 'react';
import { Message, Grid, Button, Icon } from 'semantic-ui-react';
import web3 from '../../Ethereum/web3.js';
import Bill from '../../Ethereum/bill.js';
import { Router } from '../../routes.js';
import Layout from '../../components/billsComponents/Layout.js';
class Request extends Component {
    static async getInitialProps(props) {
        const index = props.query.billIndex;
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        const billData = await bill.methods.bills(index).call();
        return { index, billData }
    }
    state = {
        billName: this.props.billData.name,
        description: this.props.billData.proposal,
        finalized: this.props.billData.finalized,
        icon: (this.props.billData.finalized) ? 'check' : 'close',
        votes: this.props.billData.upvotes,
        index: this.props.index
    }
    // async renderData(){
    //     const {index} = this.props;
    //     const accounts = await web3.eth.getAccounts();
    //     const bill = Bill();
    //     const billData=await bill.methods.bills(index).call();
    //     this.setState({
    //         billName : billData.name,
    //         description:billData.proposal,
    //         finalized : billData.finalized,
    //         votes:billData.upvotes,
    //         icon:(this.state.finalized)? 'check':'close'
    //     });
    // }
    async vote(voteIndex) {
        //0 - upVote | 1- downVote
        if (this.state.finalized) return;
        const { index } = this.props;
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        await bill.methods.voteBill(index, voteIndex).send({
            from: accounts[0]
        });
        Router.replaceRoute(`/bills/requests/${this.props.index}`);
    }
    finalize = async () => {
        if (this.state.finalized) return;
        const accounts = await web3.eth.getAccounts();
        const bill = Bill();
        await bill.methods.finalizeBill(this.props.index).send({
            from: accounts[0]
        });
        Router.replaceRoute(`/bills/requests/${this.props.index}`);
    }
    render() {
        //this.renderData();
        console.log(this.state.finalized)
        return (
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
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="center" verticalAlign="middle">
                        <div style={{ marginTop: 20 }}></div>
                        <Button positive icon disabled={this.state.finalized} labelPosition="right" onClick={() => this.vote(0)} labelPosition="right">
                            Up-Vote <Icon name="chevron up" /> 
                        </Button>
                        
                        <div style={{ marginTop: 20 }}></div>
                        <Button negative icon disabled={this.state.finalized} labelPosition="right" onClick={() => this.vote(1)}>
                            Down-Vote <Icon name="chevron down" />
                        </Button>

                        <div style={{ marginTop: 20 }}></div>
                        <Button primary icon labelPosition="right" disabled={this.state.finalized} onClick={this.finalize}> 
                            Finalized <Icon name={this.state.icon} />
                        </Button>
                        
                        <div style={{ marginTop: 20 }}></div>
                        <Message info size="large" compact content="Total up-votes" header={this.state.votes} />
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}
export default Request;