import React,{Component} from 'react';
import {Modal,Icon,Image,Button,Message} from 'semantic-ui-react';
import {Router} from '../routes.js';
import ECOI from './images/ECOI.png';
class Receipt extends Component{
    state={
        open:true
    }
    reload=()=>{
        this.setState({open:false});
        Router.replaceRoute('/');
    }
    render(){
        const {txHash,address,timestamp} = this.props;
        return(
            <>
                <div id="element">
                    <Modal
                        centered
                        size="small"
                        style={{marginTop:-280}}
                        open={this.state.open}
                        onClose={this.reload}
                    >
                        <Modal.Header>Voting Receipt</Modal.Header>
                        <Modal.Content image>
                            <Image size="small" src={ECOI} centered/>
                        </Modal.Content>
                        <Message header="Thank You for voting" content="Your vote is securely stored on blockchain. Here are your details" size="small"  info style={{paddingLeft:160}} />
                        <Modal.Description style={{marginLeft:60,marginBottom:20 }}>
                            <p>
                                <b>TxHash: </b>
                                {txHash===undefined? '--' : txHash}
                            </p>
                            <p>
                                <b>Address: </b>
                                {address===undefined? '--':address}
                            </p>
                            <p>
                                <b>Timestamp:</b> 
                                {timestamp===undefined? '--':timestamp}
                            </p>
                        </Modal.Description>
                        <Modal.Actions>
                            <Button id="download" onClick="download()" positive>
                                <Icon name="download"/>
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </div>
            </>
        );
    }
}
export default Receipt;