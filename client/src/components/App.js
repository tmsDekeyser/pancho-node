import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import logo from '../assets/logo.png'

class App extends Component {
    state = { walletInfo: { publicKey: 'foobar', balance: { token: 1000, flow: 200}}};

    componentDidMount() {
        fetch(`${document.location.origin}/wallet-info`)
        .then(response => response.json())
        .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { publicKey } = this.state.walletInfo;
        const { token, flow } = this.state.walletInfo.balance;
        
        return (
            <div className='App'>
                <img className='logo' src={logo}></img>
                <br />
                <div><h1>pancho demo</h1></div>
                <br />
                <div className="Button"><Link to='/blockchain'><Button variant="outline-warning">Blockchain</Button></Link></div>
                <div className="Button"><Link to='/conduct-transaction'>
                        <Button variant="outline-warning">Conduct Transaction</Button>
                    </Link>
                </div>
                <div className="Button"><Link to='/transaction-pool'>
                        <Button variant="outline-warning">Transaction Pool</Button>
                    </Link>
                </div>
                <br />
                <div className="WalletInfo">
                <div>Address: {publicKey}</div>
                <br />
                <div><h4>Balance</h4></div>
                <div><em>tokens:</em> {token}</div>
                <div><em>flow:</em> {flow}</div>
                </div>
                <br />
            </div>
            
        );
    }
}

export default App;