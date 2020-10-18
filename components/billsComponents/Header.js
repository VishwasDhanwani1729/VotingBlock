import React, { Component } from 'react';
import {Menu} from 'semantic-ui-react';
import {Link} from '../../routes.js'
class Header extends Component{
    state={
        active:(this.props.page===undefined? '':this.props.page),
    }
    changeHeader=(e,{name})=> this.setState({active:name})
    render(){
        return(
            <Menu style={{marginTop:40}}>
                <Link route="/bills">
                    <a>
                        <Menu.Item header>Bills</Menu.Item>
                    </a>
                </Link>
                <Link route='/bills/propose'>
                    <a>
                        <Menu.Item
                            name="Propose"
                            active={this.state.active === 'propose'}
                            onClick={this.changeHeader}
                        />
                    </a>
                </Link>
                <Link route='/bills/transactions'>
                    <a>
                        <Menu.Item
                            content='Transactions'
                            active={this.state.active === 'transactions'}
                            onClick={this.changeHeader}
                        />
                    </a>
                </Link>
                <Menu.Menu position="right">
                    <Link route='/'>
                        <a>
                            <Menu.Item
                                content='Voting Block'
                                active={this.state.active === 'index'}
                                onClick={this.changeHeader}
                            />
                        </a>
                    </Link>
                </Menu.Menu>
            </Menu>
        );
    }
}
export default Header;