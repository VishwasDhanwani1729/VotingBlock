import React, { Component } from 'react';
import {Card,Image, Loader,Dimmer,Header} from 'semantic-ui-react';
class Candidates extends Component{

    render(){
        console.log(this.props.id);

        return(
            <Card
                onClick={this.props.onClick}
                image={`https://ipfs.io/ipfs/${this.props.candidate.ipfsHash}`}
                header={this.props.candidate.partyName}
                meta={'Votes : '+this.props.candidate.voteCount}
                description={this.props.candidate.candidateName}
            />
        );
    }
}

export default Candidates;