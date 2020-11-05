import React, { Component } from 'react';
import { Grid, Form, Message, Input, Button } from 'semantic-ui-react';
import web3 from '../Ethereum/web3.js';
import Election from '../Ethereum/election.js';
import ipfs from '../ipfs.js';
class CandidateForm extends Component {
    state = {
        errorMessageC: '',
        successfullC: false,
        loadingC:false,
        partyName:'',
        candidateName:'',
        candidateAddress:'',
        buffer:null,
        ipfsHash:'',

        errorMessageV: '',
        successfullV: false,
        loadingV:false,
        voterAddress:''
    }
    constructor(props){
        super();
        this.imageUploaded=this.imageUploaded.bind(this);
        this.submitFormOfCandidate=this.submitFormOfCandidate.bind(this);
    }
    async setIpfs(event){
        try{
             
        }catch(err){
            this.setState({errorMessageC:err.message,successfullC:false});
        }
    }
    submitFormOfCandidate = async event => {
        //event.preventDefault();
        this.setState({ errorMessageC:'',loadingC:true,successfullC:false , successfullV:false , errorMessageV:'' });
        //ipfs
        ipfs.add(this.state.buffer, async (err,res)=>{
            if(err){
                console.error(err);
                return;
            }
            this.setState({ipfsHash: await res[0].hash});

            try{
                const accounts = await web3.eth.getAccounts();
                const election = Election();
                const {partyName,candidateName,candidateAddress,ipfsHash}= this.state;
                console.log('**'+ipfsHash);
                //(string partyName,string candidateName,address add,string imageHash)
                await election.methods.addCandidate(partyName,candidateName,candidateAddress,this.state.ipfsHash).send({
                    from:accounts[0]
                });
                this.setState({ successfullC: true });    
            }catch(err){
                this.setState({errorMessageC:err.message,successfullC:false})
            }



            
            console.log('=>'+this.state.ipfsHash);
            console.log(res);
        });
        
        this.setState({loadingC:false});
    }
    submitFormOfVoter = async event =>{
        this.setState({ errorMessageV:'',loadingV:true , successfullV:false,successfullC:false , errorMessageC:'' });
        try{
            const accounts = await web3.eth.getAccounts();
            const election = Election();
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
    async imageUploaded(event){
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        console.log(reader);
        reader.onloadend=()=>{
            this.setState({buffer  : Buffer.from(reader.result)});
        }
        console.log(this.state.buffer);
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
                        <Form className="attached fluid segment" widths="equal" onSubmit={this.submitFormOfCandidate} error={!!this.state.errorMessageC} success={this.state.successfullC}>
                            <Form.Field>
                                <label>Party Name</label>
                                <input required value={this.state.partyName} onChange={event=>{this.setState({partyName:event.target.value})}}/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Candidate Name</label>
                                <input required value={this.state.candidateName} onChange={event=>{this.setState({candidateName:event.target.value})}} />
                            </Form.Field>
                            <Form.Field required>
                                <label>Address</label>
                                <input required value={this.state.candidateAddress} onChange={event=>{this.setState({candidateAddress:event.target.value})}}/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Upload logo</label>
                                <input type="file" onChange={this.imageUploaded} accept="image/png,image/jpeg"/>
                            </Form.Field>
                            <Message success header="Successfull🙏" content="candidate registered" />
                            <Message error header="Oops...." content={this.state.errorMessageC} />
                            <Button primary loading={this.state.loadingC}>Add Candidate</Button>
                        </Form>
                    </Grid.Column>
                    <Grid.Column>
                        <Message attached header="Please enter voter details" />
                        <Form className="attached fluid segment" widths="equal" onSubmit={this.submitFormOfVoter} error={!!this.state.errorMessageV} success={this.state.successfullV}>
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