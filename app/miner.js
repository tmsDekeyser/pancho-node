const Wallet = require('../wallet');

const Transaction = require('../wallet/transaction');

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions(); //make improvements to allow for selection of tx
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()) // to be updated with dividend transaction
    );
    const block = this.blockchain.addBlock(validTransactions);
    this.p2pServer.broadcastChain();
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions(); //I don't like this here: or change the clear() fucntion in tp_pool

    return block;
  }
}

module.exports = Miner;