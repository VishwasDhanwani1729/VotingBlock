import React, { Component } from 'react';
import {Menu} from 'semantic-ui-react';
import {Router,Link} from '../routes.js'
import Election from '../Ethereum/election.js';
import web3 from '../Ethereum/web3.js';
class Header extends Component{
    state={
        active:(this.props.page===undefined? '':this.props.page),
        electionState:''
    }
    changeHeader=(e,{name})=> this.setState({active:name})

    async renderState(){
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        const stateValue = await election.methods.state().call();
        if(stateValue==='0')
            this.setState({electionState : 'Campaigning'});
        else if(stateValue==='1')
            this.setState({electionState : 'Voting'});
        else
            this.setState({electionState : 'Result'});
    }
    changeState=async event=>{
        const accounts = await web3.eth.getAccounts();
        const election = Election('0x42a2C35f3C8cF5d1aa6230fF57f7260aCb9E06Be');
        const owner = await election.methods.owner().call();
        if(owner!=accounts[0])  return; //this means other than owner is trying to change state which is not possible hence return and do nothing

        //if not then
        let stateValue=-1;
        if(this.state.electionState=='Campaigning'){
            stateValue=1;
            this.setState({electionState:'Voting'});
        }else if(this.state.electionState=='Voting'){
            stateValue=2;
            this.setState({electionState:'Result'});
        }else if(this.state.electionState=='Result'){
            stateValue=0;
            this.setState({electionState:'Campaigning'});
        }
        const method=await election.methods.changeState(stateValue).send({
            from : accounts[0]
        });
        console.log(method);
        Router.replaceRoute('/'+this.state.active);
    }
    render(){
        this.renderState();
        return(
            <>
            <Menu style={{marginTop:40}}>
                <Link route="/">
                    <a>
                        <Menu.Item header>VotingBlock</Menu.Item>
                    </a>
                </Link>
                <Link route='/results'>
                    <a>
                        <Menu.Item
                            name="Results"
                            active={this.state.active === 'results'}
                            onClick={this.changeHeader}
                        />
                    </a>
                </Link>
                <Link route='/candidates'>
                    <a>
                        <Menu.Item
                            content='Add Candidate'
                            active={this.state.active === 'candidates'}
                            onClick={this.changeHeader}
                        />
                    </a>
                </Link>
                
                <Link route='/bills'>
                    <a>
                        <Menu.Item
                            content="Bills"
                            active={this.state.active === "bills"}
                            onClick={this.changeHeader}
                        />
                    </a>
                </Link>
                <Menu.Menu position="right">
                    <Menu.Item
                        content={this.state.electionState}
                        onClick={this.changeState}
                    />
                    <Menu.Item
                        content="Timer"
                        disabled
                    />
                </Menu.Menu>
            </Menu>

            </>
        );
    }
}
export default Header;