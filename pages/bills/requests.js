import React, { Component } from 'react';
import {Message,Grid,Button,Icon} from'semantic-ui-react';
import Layout from '../../components/billsComponents/Layout.js';
class Request extends Component{
    render(){
        return(
            <Layout>
                <Message size="small">
                    <Message.Header>Note</Message.Header>
                    <Message.List>
                        <Message.Item>Voter can either up-vote or down-vote.</Message.Item>
                        <Message.Item>To pass a bill it must get 50% votes from public.</Message.Item>
                    </Message.List>
                </Message>
                <Grid columns={2} relaxed="very">
                    <Grid.Column width={10} textAlign="justified">
                        <b>Bill Name</b>
                        <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum laboriosam in eveniet provident optio natus dolorum cumque inventore nostrum accusamus dolores maxime animi, necessitatibus est distinctio recusandae totam nobis atque magni deserunt veniam. Voluptates, aspernatur atque? Dolor at commodi ut in nesciunt vel placeat repellat voluptate. Minus, quisquam est. Sunt maxime natus alias vitae, eum ipsum commodi doloremque nam impedit iure fugit dolore qui quidem recusandae dolor possimus excepturi laudantium ea. Aspernatur aut suscipit voluptates quos ad dignissimos eum molestiae quod natus, quae, placeat laboriosam, repudiandae accusantium nulla error enim. Harum at, qui ipsa totam ducimus accusamus omnis nulla, consequatur consequuntur officia voluptas magni quisquam iure numquam rerum voluptates perferendis! Cupiditate possimus obcaecati nisi aspernatur explicabo, eos in porro consequatur impedit illum qui, molestiae soluta iure, ea repudiandae ut at nobis odit. Quia sapiente voluptates delectus ducimus quas laborum, veniam libero velit suscipit, iure magni molestiae mollitia itaque sed dolore. Eum consequatur, adipisci quibusdam facilis distinctio dolore quidem exercitationem earum ipsam necessitatibus accusantium commodi. Aspernatur consequatur iusto deserunt rem mollitia ipsam, assumenda, neque, perspiciatis minus suscipit et! Voluptates numquam quisquam consequuntur, nihil molestiae ex rerum maxime unde delectus obcaecati. Molestias assumenda suscipit voluptate vero fugit inventore ab, eligendi ipsa reiciendis.
                        </p>
                        <Icon size="big" name="time"/>
                    </Grid.Column>
                    <Grid.Column width={6} textAlign="center" verticalAlign="middle">
                        <Button positive>Up-Vote <Icon name="chevron up"/> </Button>
                        <div style={{marginTop:20}}></div>
                        <Button negative>Down-Vote <Icon name="chevron down"/></Button>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}
export default Request;