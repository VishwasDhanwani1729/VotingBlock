import React, { Component } from 'react';
import {Card,Image, Loader,Dimmer,Header} from 'semantic-ui-react';
import bjp from './images/bjp.png';
class Candidates extends Component{
    render(){
        console.log(this.props.id);
        return(
            <Card
                onClick={this.props.onClick}
                image={bjp}
                header={this.props.candidate.name}
                meta={'Votes : '+this.props.candidate.voteCount}
                description="Bhartiya Janta Party"
            />
        );
    }
}

export default Candidates;