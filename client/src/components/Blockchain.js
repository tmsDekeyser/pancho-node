import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Block from './Block'

class Blockchain extends Component {
    state = { blockchain: [] };

    componentDidMount() {
        fetch(`${document.location.origin}/blockchain`)
        .then(response => response.json())
        .then(json => this.setState({ blockchain: json.chain }));
    }

    render() {
        console.log(this.state.blockchain)
        return (
            <div className="Blockchain">
                <div className="Button"><Button variant="outline-warning"><Link to='/'>Homepage</Link></Button></div>
                <br />
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