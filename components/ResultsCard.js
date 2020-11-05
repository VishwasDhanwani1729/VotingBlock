import React, { Component } from 'react';
import {Card} from 'semantic-ui-react';
class ResultsCard extends Component{
    render(){
        return(
            <Card
                header={this.props.candidate.partyName}
                meta={'Votes : '+this.props.candidate.voteCount}
                description={this.props.candidate.candidateName}
            />
        );
    }
}
export default ResultsCard;