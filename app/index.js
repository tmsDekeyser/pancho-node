const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const bc = new Blockchain();
const wallet = new Wallet();
const tp = new TransactionPool();
const p2pServer = new P2pServer(bc, tp);
const miner = new Miner(bc, tp, wallet, p2pServer);
const app = express();

const HTTP_PORT = process.env.HTTP_PORT || 3001;

app.listen(HTTP_PORT, () => console.log("Listening on port " + `${HTTP_PORT}`));
p2pServer.listen();

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

    p2pServer.broadcastChain();

    res.redirect("/blockchain");
});

app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
  });
  
  app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.broadcastTransaction(transaction);
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
  