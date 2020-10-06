import React, { Component } from 'react';
import { Grid, Form, Message, Input, Button } from 'semantic-ui-react';
import web3 from '../Ethereum/web3.js';
import Election from '../Ethereum/election.js';
class CandidateForm extends Component {
    state = {
        errorMessageC: '',
        successfullC: false,
        loadingC:false,
        candidateName:'',
        candidateAddress:'',

        errorMessageV: '',
        successfullV: false,
        loadingV:false,
        voterName:'',
        voterAddress:''
    }
    submitFormOfCandidate = async event => {
        this.setState({ errorMessageC:'',loadingC:true,successfullC:false , successfullV:false , errorMessageV:'' });
        try{
            const accounts = await web3.eth.getAccounts();
            const election = Election('0x9d57Fd0F923CCEe9eFd7f4715C64f99a4b877E1A');
            const name=this.state.candidateName;
            await election.methods.addCandidate(name).send({
                from:accounts[0]
            });
            this.setState({ successfullC: true });    
        }catch(err){
            this.setState({errorMessageC:err.message,successfullC:false})
        }
        this.setState({loadingC:false});
    }
    submitFormOfVoter = async event =>{
        this.setState({ errorMessageV:'',loadingV:true , successfullV:false,successfullC:false , errorMessageC:'' });
        try{
            const accounts = await web3.eth.getAccounts();
            const election = Election('0x9d57Fd0F923CCEe9eFd7f4715C64f99a4b877E1A');
            const address = this.state.voterAddress;
            await election.methods.addVoter(address).send({
                from:accounts[0]
            });
            this.setState({successfullV:true});
        }catch(err){
            this.setState({errorMessageV:err.message,successfullV:false})
        }
        this.setState({loadingV:false});
    }
    render() {
        return (
            <>
                <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Only owner can add candidates and voters</Message.Item>
                        <Message.Item>Make sure that state is "Campaigning"</Message.Item>
                    </Message.List>
                </Message>
                <Grid columns={2} relaxed="very">
                    <Grid.Column>
                        <Message attached header="Please enter candidate details" />
                        <Form className="attached fluid segment" widths onSubmit={this.submitFormOfCandidate} error={!!this.state.errorMessageC} success={this.state.successfullC}>
                            <Form.Field required>
                                <label>Candidate Name</label>
                                <input required value={this.state.candidateName} onChange={event=>{this.setState({candidateName:event.target.value})}} />
                            </Form.Field>
                            <Form.Field required>
                                <label>Address</label>
                                <input required value={this.state.candidateAddress} onChange={event=>{this.setState({candidateAddress:event.target.value})}}/>
                            </Form.Field>
                            
                            <Message success header="Successfull🙏" content="candidate registered" />
                            <Message error header="Oops...." content={this.state.errorMessageC} />
                            <Button primary loading={this.state.loadingC}>Add Candidate</Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Message attached header="Please enter voter details" />
                        <Form className="attached fluid segment" widths onSubmit={this.submitFormOfVoter} error={!!this.state.errorMessageV} success={this.state.successfullV}>
                            <Form.Field required>
                                <label>Voter Name</label>
                                <input required value={this.state.voterName} onChange={event=>{this.setState({voterName : event.target.value})}} />
                            </Form.Field>
                            <Form.Field required>
                                <label>Address</label>
                                <input required value={this.state.voterAddress} onChange={event=>{this.setState({voterAddress : event.target.value})}} />
                            </Form.Field>
                            <Message success header="Registered!" content="Now, you are able to vote" />
                            <Message error header="Oops...." content={this.state.errorMessageV} />
                            <Button primary loading={this.state.loadingV}>Add Voter</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
            </>
        );
    }
}

export default CandidateForm;