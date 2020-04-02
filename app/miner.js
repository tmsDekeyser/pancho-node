const Wallet = require('../wallet');
const { DIVIDEND } = require('../config');
const DividendTx = require('../wallet/dividend-tx');

class Miner {
  constructor(blockchain, transactionPool, wallet, pubsub) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions(); //make improvements to allow for selection of tx
    if (Miner.dividendTransaction(Wallet.bankWallet(), this.blockchain)){
      validTransactions.push(Miner.dividendTransaction(Wallet.bankWallet(), this.blockchain));
    };
    
    const block = this.blockchain.addBlock(validTransactions);
    
    this.pubsub.broadcastChain();
    this.transactionPool.clear();
    this.pubsub.broadcastClearTransactions(); //I don't like this here: or change the clear() fucntion in tp_pool

    return block;
  };

  static dividendTransaction(bankWallet, blockchain) {
    let knownAddresses = blockchain.knownAddresses();
    knownAddresses.delete(bankWallet.publicKey);
    
    let dividendTx;
    
    bankWallet.balance.token = knownAddresses.size * DIVIDEND;

    for (let item of knownAddresses) {
      if (!dividendTx) {
        //dividendTx = new Transaction(bankWallet, item, DIVIDEND);
        dividendTx = new DividendTx(bankWallet, item);
      } else {
        //dividendTx.update(bankWallet, item, DIVIDEND);
        dividendTx.update(bankWallet, item);
      };
      
    };

    return dividendTx;
    
  }
}

module.exports = Miner;