const { STARTING_BALANCE } = require('../config');
const CryptoUtil = require('../crypto-util');
const Transaction = require('./transaction');
const FlowCurrency = require('./flow-currency');

class Wallet {
    constructor() {
        this.balance = new FlowCurrency();
        this.keyPair = CryptoUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return(`Wallet -
            Address (public key): ${this.publicKey.toString()},
            Balance: ${this.balance.toString()}`
        );
    }

    sign(dataHash) {
        return this.keyPair.sign(dataHash);
      }
    
    createTransaction(recipient, amount, blockchain, transactionPool) {
      this.balance = this.calculateBalance(blockchain);
  
      if (amount > this.balance.token) {
        console.log(`Amount: ${amount} exceceds current balance: ${this.balance.toString()}`);
        return;
      }
  
      let transaction = transactionPool.existingTransaction(this.publicKey);
  
      if (transaction) {
        transaction.update(this, recipient, amount);
      } else {
        transaction = new Transaction(this, recipient, amount);
        transactionPool.updateOrAddTransaction(transaction);
      }
  
      return transaction;
    }
  
    calculateBalance(blockchain) {
      let balance = this.balance;
      let txList = [];
      let lastTx = null;
    
      do {
        let i = blockchain.chain.length - 1;
        let block = blockchain.chain[i];

        block.filter(tx => {
          if (tx.input.address === this.publicKey) {
            lastTx = tx;
          };

          for (let j = 0; j < tx.output.length; j++) {
            let entry = tx.output[j];

            if (entry.address === this.publicKey) {
              txList.push(tx);
              break; // to avoid pushing the same transaction to the txList twice.
            }
          };
          
        });
        i--;
      } while (lastTx == 0);

      const senderOutput = lastTx.output.find(entry => entry.address === this.publicKey);
      let receivedTokens= 0;
      txList.forEach(tx => {
        tx.output.forEach(entry => {
          if (entry.address === this.publicKey) {
            receivedTokens += entry.ledgerEntry.token;
          };
        });
      });

      balance.token = senderOutput.ledgerEntry.token  + receivedTokens;
      balance.flow = senderOutput.ledgerEntry.flow + receivedTokens;

      return balance;

    }
  
    static blockchainWallet() {
      const blockchainWallet = new this();
      blockchainWallet.address = 'blockchain-wallet';
      return blockchainWallet;
    }  
}

module.exports = Wallet;