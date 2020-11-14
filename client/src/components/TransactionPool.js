import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import history from '../history';
const REFRESH_INTERVAL = 10000;

class TransactionPool extends Component {
    state = { transactionArray: [] };


    fetchTransactionPoolArray = ()=> {
        fetch(`${document.location.origin}/api/transactions`)
        .then(response => response.json())
        .then(json => this.setState({ transactionArray: json}));
    }

    fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
          .then(response => {
            if (response.status === 200) {
              alert('success');
              history.push('/blockchain');
            } else {
              alert('The mine-transactions block request did not complete.');
            }
          });
        }

    componentDidMount() {
        this.fetchTransactionPoolArray();

        this.fetchPoolArrayInterval = setInterval(
            () => this.fetchTransactionPoolArray()
            , REFRESH_INTERVAL
        );
    }

    componentWillUnmount(){
        clearInterval(this.fetchPoolArrayInterval);
    }

    render() {
        return(
            <div className='TransactionPool'>
                <div className="Button"><Link to='/'><Button variant="outline-warning">Homepage</Button></Link></div>
                <h3>Transaction Pool</h3>
                {
                Object.values(this.state.transactionArray).map(transaction => {
                    return (
                    <div key={transaction.id}>
                        <hr />
                        <Transaction transaction={transaction} />
                    </div>
                    )
                })
                }
                <hr />
                <Button variant="warning" onClick={this.fetchMineTransactions}>
                    Mine the transactions in the pool
                </Button>
            </div>
        )
    }
}

export default TransactionPool;