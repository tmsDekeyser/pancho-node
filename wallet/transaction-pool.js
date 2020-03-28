const Transaction = require('../wallet/transaction');

class TransactionPool {
  constructor() {
    this.transactions = [];
  }

  updateOrAddTransaction(transaction) {
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
      this.transactions.push(transaction);
    }
  }

  existingTransaction(address) {
    return this.transactions.find(t => t.input.address === address);
  }

  //Would it not be more interesting to look for invalid transactions?
  validTransactions() {
    return this.transactions.filter(transaction => {
      if (transaction.verifyTransaction()){
        return transaction;
      };
    });
  }

  //Aanpassen zodaning dat een selectie van transacties gecleard kan worden ipv allemaal
  clear() {
    this.transactions = [];
  }
}

module.exports = TransactionPool;