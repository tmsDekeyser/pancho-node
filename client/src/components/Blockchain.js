import React, { Component } from 'react';
import Block from './Block'

class Blockchain extends Component {
    state = { blockchain: [] };

    componentDidMount() {
        fetch('http://localhost:3000/blockchain')
        .then(response => response.json())
        .then(json => this.setState({ blockchain: json.chain }));
    }

    render() {
        console.log(this.state.blockchain)
        return (
            <div>
                <h3>Blockchain</h3>
                {
                    this.state.blockchain.map(block => {
                        return (
                        <Block key = {block.hash} block={block}/>
                        )
                    })
                }
            </div>
        );
    }
}

export default Blockchain;