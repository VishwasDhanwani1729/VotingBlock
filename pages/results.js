import React, { Component } from 'react';
import {Message} from 'semantic-ui-react';
import Layout from '../components/Layout.js';
class index extends Component{
    render(){
        return(
            <Layout page="results">
               <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Results would be declared here.</Message.Item>
                        <Message.Item>Winnig party would receive the tokens.</Message.Item>
                    </Message.List>
                </Message>
                 
            </Layout>
        );
    }
}
export default index;