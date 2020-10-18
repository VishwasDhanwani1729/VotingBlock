import React, { Component } from 'react';
import {Card ,Message,Dimmer,Loader,Modal} from 'semantic-ui-react';
import Layout from '../components/Layout.js'
import web3 from '../Ethereum/web3.js';
import Election from '../Ethereum/election.js';
import Candidates from '../components/Candidates.js';
import Receipt from '../components/Receipt.js';
import {Router} from '../routes.js';
class index extends Component{
    state={
        dimmerActive:false,
        eligibileMsg:false,
        txHash:'--',
        voterAddress:'--',
        timestamp:'--',
        showReceipt:false,
        resultsDeclared:false,
        winner:''
    }
    static async getInitialProps(){
        const accounts = await web3.eth.getAccounts();
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        const owner = await election.methods.owner().call();
        const candiadatesCount = await election.methods.totalCandidates().call();
        const votingStatus = await election.methods.state().call();

        // we can't return customized array from contract so we have to get all candidates by calling  for each index
        const candidates = await Promise.all(
                Array(parseInt(candiadatesCount))
                    .fill()
                    .map((element,index)=>{
                        return election.methods.candidates(index).call();
                    })
        );
        return {candidates,owner,candiadatesCount,votingStatus};
    }
    async voting(index,candidate){
        console.log('voting');
        this.setState({dimmerActive:true,eligibileMsg:false});
        const {votingStatus} = this.props;
        if(votingStatus!='1'){   
            this.setState({dimmerActive:false});
            return; //means it is not in voting state only in voting state a person can vote
        }
        const accounts = await web3.eth.getAccounts();
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        const voter = await election.methods.voters(accounts[0]).call();
        if(!voter.authorized){
            //which means voter is not authorized and can't vote
            console.log('Not Authorized');
            this.setState({eligibileMsg:true,dimmerActive:false});
            return;
        }
        try{
            const hash = await election.methods.voting(index).send({
                from:accounts[0]
            });
            //this.setState({hash});
            console.log(hash.events);
            console.log(hash.events.receipt);
            console.log(hash.events.receipt.returnValues["voterAddress"]);
            console.log(hash.events.receipt.returnValues["timeOfVote"]);
            console.log(hash.events.receipt.returnValues[0]);
            console.log(hash.events.receipt.returnValues[1]);
            this.setState({
                txHash:hash.transactionHash,
                voterAddress:hash.from,
                timestamp:hash.events.receipt.returnValues["timeOfVote"],
                showReceipt:true
            });
            //console.log(hash.events.receipt.transactionHash)
        }catch(err){
            console.log(err.message);
        }
        this.setState({dimmerActive:false});
        

        console.log('Candidate Name '+candidate.name);
        console.log('Index : '+index);

    }
    
    renderCandidates(){
      return (this.props.candidates.map((candidate,index)=>{
            console.log('=>'+index);
            /*if(this.state.resultsDeclared){
                if(candidate.name==this.state.winner){
                    return (
                        <>
                            <Message header="Congractulations!!🎉🎉" content="This party has won the election."/>
                            <Candidates onClick={()=>this.voting(index,candidate)} key={index} id={index} candidate={candidate}/>    
                        </>
                    )
                }
            }*/
                return <Candidates onClick={()=>this.voting(index,candidate)} key={index} id={index} candidate={candidate}/>
      }));
    }
    async checkForResults(){
        if(this.props.votingStatus!='2')return;
        if(this.state.resultsDeclared)return;
        const accounts = await web3.eth.getAccounts();
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        try{
            const winnerName = await election.methods.results().send({
                from:accounts[0]
            });
            await election.methods.changeState(0).send({
                from:accounts[0]
            });
            this.setState({resultsDeclared:true,winner:winnerName});
            Router.replaceRoute('/');
        }
        catch(err)
        {
            console.log(err.message);
        }
    }
    render(){
        //this.checkForResults();
        //console.log(this.state.winner);
        return(
            <Layout>
                <div style={{marginBottom:20}}></div>
                
                <Modal
                    open={this.state.eligibileMsg}
                    header='Not Registered!'
                    content='You can not vote'
                    centered={false}
                    size="tiny"
                    actions={[{ key: 'Okay', content: 'Okay', positive: true }]}
                    onActionClick={()=>this.setState({eligibileMsg : false})}
                />
                {
                    (this.state.showReceipt)? <Receipt
                        txHash={this.state.txHash}
                        address={this.state.voterAddress}
                        timestamp={this.state.timestamp}
                        show={true}
                    />:null
                }
                <Message visible>Owner's Address : {this.props.owner}</Message>
                <Dimmer active={this.state.dimmerActive}>
                <Loader>Requesting</Loader>
                </Dimmer>
                
                <Card.Group itemsPerRow={4}>
                    {this.renderCandidates()}
                </Card.Group>
            </Layout>
        );
    }
}
export default index;