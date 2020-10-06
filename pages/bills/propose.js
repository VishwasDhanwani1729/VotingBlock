import React, { Component } from 'react';
import {Message,Form,Button} from'semantic-ui-react';
import Layout from '../../components/billsComponents/Layout.js';
class Propose extends Component{
    render(){
        return(
            <Layout>
                <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Winning party can only propose a bill</Message.Item>
                        <Message.Item>To pass a bill it must get 50% votes from public</Message.Item>
                    </Message.List>
                </Message>
                <Message attached header="Bill details" />
                        <Form className="attached fluid segment" widths>
                            <Form.Field required>
                                <label>Bill Name</label>
                                <input/>
                            </Form.Field>
                            <Form.Field required>
                                <label>Proposal</label>
                                <textarea/>
                            </Form.Field>
                            <Form.Field width={4}>
                                <label>Time</label>
                                <input type="datetime-local"></input>
                            </Form.Field>
                            <Message success header="Successfull🙏" content="candidate registered" />
                            <Message error header="Oops...." content="something went wrong  " />
                            <Button primary>Propose!</Button>
                        </Form>
            </Layout>
        );
    }
}
export default Propose;