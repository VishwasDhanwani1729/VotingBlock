import React, { Component } from 'react';
import {Card,Message,Grid,Header} from 'semantic-ui-react';
import Layout from '../components/Layout.js';
import web3 from '../Ethereum/web3.js';
import Election from '../Ethereum/election.js';
import ResultsCard from '../components/ResultsCard.js';
class index extends Component{
    static async getInitialProps(){
        const accounts = await web3.eth.getAccounts();
        const election = Election();
        const stateValue=await election.methods.state().call();
        let resultDeclared=false;
        console.log('##'+accounts[0]);
        let wCandidate,candidates,billContract;
        if(stateValue=='2'){
            resultDeclared=true;
            wCandidate =  await election.methods.winnigParty().call();
            console.log(wCandidate);
           if(wCandidate.partyName==''){
                await election.methods.results().send({
                    from:accounts[0]
                });
            }
            wCandidate =  await election.methods.winnigParty().call();
            const candiadatesCount = await election.methods.totalCandidates().call();
            candidates = await Promise.all(
                Array(parseInt(candiadatesCount))
                    .fill()
                    .map((element,index)=>{
                        return election.methods.candidates(index).call();
                    })
             );
             billContract = await election.methods.billContract().call();
                    //console.log(billContract);
        }
        return {accounts,election,resultDeclared,wCandidate,candidates,billContract};
    }
    winner(){
        return(<>
            <Grid>
                <Grid.Row>
                    <Grid.Column width="6">
                            <Card
                                centered
                                image={`https://ipfs.io/ipfs/${this.props.wCandidate.ipfsHash}`}
                                header={this.props.wCandidate.partyName}
                                meta={'Votes : '+this.props.wCandidate.voteCount}
                                description={this.props.wCandidate.candidateName}
                            />
                    </Grid.Column>
                    <Grid.Column width="10" verticalAlign="middle">
                        <Header content="Other parties stats"/>
                        <Card.Group itemsPerRow={2}>
                            {this.props.candidates.map((candidate,index)=>{
                                if(candidate.partyName!=this.props.wCandidate.partyName){
                                return (
                                    <ResultsCard key={index} id={index} candidate={candidate}/>
                                )}
                                return;
                            })}
                        </Card.Group> 
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width="16">
                        <Message>
                            <Message.Header>Winning Party</Message.Header>
                           <p> Party Address : {this.props.wCandidate.candidateAddress} </p>
                            <p>Bill Contract Address : {this.props.billContract}</p>
                        </Message>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>);
    }
    notDeclared(){
        return(
            <Message info header="Not declared yet!!" content="come back soon...."/>
        );
    }
    render(){
//        console.log(this.props.resultDeclared);
        return(
            <Layout page="results">
               <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Results would be declared here.</Message.Item>
                        <Message.Item>Please check the state.</Message.Item>
                    </Message.List>
                </Message>
                {(this.props.resultDeclared)? this.winner() : this.notDeclared()}
            </Layout>
        );
    }
}
export default index;