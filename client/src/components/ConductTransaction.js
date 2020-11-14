import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import history from '../history'
import { Link } from 'react-router-dom';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0};

    updateRecipient = event => {
        this.setState({recipient: event.target.value});
    }

    updateAmount = event => {
        this.setState({amount: Number(event.target.value)});
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;

        fetch(`${document.location.origin}/api/transact`, {
            method: 'POST',
            headers: { 'Content-type' : 'application/json'},
            body: JSON.stringify({ recipient, amount })
        }).then(response => response.json())
        .then(json => {
            alert(json.message || json.type)
        });
        history.push('/transaction-pool')
    }

    render() {
        return(
            <div className="ConductTransaction">
                <div className="Button"><Link to='/'><Button variant="outline-warning">Homepage</Button></Link></div>
                <h3>Conduct a Transaction</h3>
                <FormGroup>
                    <FormControl 
                        input='text'
                        placeholder='recipient'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                    />
                </FormGroup>
                <FormGroup>
                <FormControl 
                        input='text'
                        placeholder='amount'
                        value={this.state.amount}
                        onChange={this.updateAmount}
                    />
                </FormGroup>
                <div>
                    <Button variant='warning' onClick={this.conductTransaction}>Submit</Button>
                </div>
            </div>
        )
    }
}

export default ConductTransaction;