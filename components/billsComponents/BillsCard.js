import React, { Component } from 'react';
import {Card} from 'semantic-ui-react';
import {Link} from '../../routes.js';
class BillsCard extends Component{
    render(){
        return(<Card
            header={this.props.billName}
            meta={this.props.proposal.substring(0,250)+'....'}
            description={(<Link route={`/bills/requests/${this.props.id}`}>
                <a>View Details</a>
                </Link>)}
            fluid="true"
        />);
    }
}
export default BillsCard;