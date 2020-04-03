import React, { Component } from 'react';
import Blockchain from './Blockchain';
import logo from '../assets/logo.png'

class App extends Component {
    state = { walletInfo: { publicKey: 'foobar', balance: { token: 1000, flow: 200}}};

    componentDidMount() {
        fetch('http://localhost:3000/wallet-info')
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
                <div>Welcome to the pancho demo</div>
                <br />
                <div className="WalletInfo">
                <div>Address: {publicKey}</div>
                <div>Balance</div>
                <div>tokens: {token}</div>
                <div>flow: {flow}</div>
                </div>
                <br />
                <Blockchain />
            </div>
            
        );
    }
}

export default App;