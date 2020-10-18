import React,{Component} from 'react';
import {Modal,Icon,Image,Button,Message,Header} from 'semantic-ui-react';
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
                    <Modal
                        centered
                        size="small"
                        style={{marginTop:-280}}
                        open={this.state.open}
                        onClose={this.reload}
                    >
                    <div id="receiptData">
                        <Header block size="huge"   content="Voting Receipt"/>
                        <Modal.Content image>
                            <Image size="small" src={ECOI} centered/>
                        </Modal.Content>
                        <Header block content="Thank You for voting" subheader="Your vote is securely stored on blockchain. Here are your details." color="black" style={{backgroundColor:'Azure',paddingLeft:60}}/>
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
                        <div></div>
                        </div>
                        <Modal.Actions>
                            <Button id="downloadReceipt" onClick={()=>{
                                let ele = document.getElementById('receiptData');
                                let length="990";
                                let width="549";
                                let type="png";
                                let filename="html2png";
                                html2canvas(ele).then(function(canvas){
                                    Canvas2Image.saveAsImage(canvas,length,width,'png');
                                });
                            }} positive>
                                <Icon color="black" name="download"/>
                            </Button>
                        </Modal.Actions>
                    </Modal>
            </>
        );
    }
}
export default Receipt;