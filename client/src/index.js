import React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route} from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blockchain from './components/Blockchain';
import ConductTransaction from './components/ConductTransaction';
import TransactionPool from './components/TransactionPool';


render(
    <Router history={history}>
        <Switch>
            <Route exact path= '/' component={App}/>
            <Route path= '/blockchain' component={Blockchain}/>
            <Route path= '/conduct-transaction' component={ConductTransaction}/>
            <Route path= '/transaction-pool' component={TransactionPool}/>
        </Switch>
    </Router>,
    document.getElementById('root')
)
