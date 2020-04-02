const express = require('express');
const bodyParser = require('body-parser');
const request = require('request'); // has been deprecated, seek alternative!!

const Blockchain = require('../blockchain');
//const P2pServer = require('./p2p-server');
const PubSub = require('./pubsub');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const pubsub = new PubSub({blockchain: bc, transactionPool: tp});
//const p2pServer = new P2pServer(bc, tp);

const miner = new Miner(bc, tp, wallet, pubsub); 
const app = express();

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;


//const HTTP_PORT = process.env.HTTP_PORT || 3001;

//app.listen(HTTP_PORT, () => console.log("Listening on port " + `${HTTP_PORT}`));
//p2pServer.listen();

app.use(bodyParser.json());

//API endpoints
app.get("/", (req, res) => {
    res.send("This is the landing page for the pancho API!"); //Add HTML landing page later
});

app.get("/blockchain", (req, res) => {
    res.json(bc);
});

//'/mine' endpoint has been upgraded to '/mine-transactions' after adding wallet/transactions functionality
app.post("/mine", (req, res) => {
    const minedBlock = bc.addBlock(req.body.data);
    console.log("A new block was mined and added to the blockchain!");

    pubsub.broadcastChain();

    res.redirect("/blockchain");
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
  });
  
app.post('/transact', (req, res) => {
  const { recipient, amount } = req.body;
  const transaction = wallet.createTransaction(recipient, amount, bc, tp);
  pubsub.broadcastTransaction(transaction);
  res.redirect('/transactions');
});
  
app.get('/mine-transactions', (req, res) => {
  const block = miner.mine();
  console.log(`New block added: ${block.toString()}`);
  res.redirect('/blockchain');
});

app.get('/wallet-info', (req, res) => {
  res.json({ balance: wallet.calculateBalance(bc), publicKey: wallet.publicKey });
});

app.get('/known-addresses', (req, res) => {
  //console.log(bc.knownAddresses());
  addressArray = Array.from(bc.knownAddresses());
  res.send(addressArray);
});

const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blockchain` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transactions` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap);
      tp.transactions = rootTransactionPoolMap;
    }
  });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
  