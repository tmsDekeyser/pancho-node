const CryptoUtil = require('../crypto-util');
const FlowCurrency = require('./flow-currency');
const { MINING_REWARD} = require('../config');

class Transaction {
  constructor(senderWallet, recipient, amount) {
    this.id = CryptoUtil.id();
    this.output = Transaction.createOutput(senderWallet, recipient, amount);
    this.input = this.createInput(senderWallet);
  }

  
  update(senderWallet, recipient, amount) {
    const senderOutput = this.output.find(output => output.address === senderWallet.publicKey);

    if (amount > senderOutput.ledgerEntry.token) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    senderOutput.ledgerEntry.token = senderOutput.ledgerEntry.token - amount;
    senderOutput.ledgerEntry.flow = senderOutput.ledgerEntry.flow + amount;
    this.output.push({ ledgerEntry: new FlowCurrency(amount, amount), address: recipient });
    //Je zou kunnen de recipient updaten als er meerdere keren dezelde recipient gebruikt wordt,
    //maar het lijkt me beter dat hier niet te doen.
    this.input = this.createInput(senderWallet);
    //Transaction.signTransaction(this, senderWallet);

    return this;
  }


  createInput(senderWallet) {
    return {
      time: Date.now(),
      tokenTotals: senderWallet.balance.token,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(CryptoUtil.hash(this.output))
    }//let op voor de volgorde van de outputs vooraleer je ze door de signature procedure gaat sturen!!!
  }

  static verifyTransaction(tx) {
    const outputTotalToken = tx.output.reduce((total, output) => {
      return total + output.ledgerEntry.token;
    }, 0);

    if (tx.input.tokenTotals !== outputTotalToken) {
      console.log(`Invalid transaction from ${tx.input.address}.`);
      return;
    }

    if (!CryptoUtil.verifySignature(
      tx.input.address,
      tx.input.signature,
      CryptoUtil.hash(tx.output)
    )) {
      console.log(`Invalid signature from ${tx.input.address}.`);
      return;
    };
    return true;
  }


  static createOutput(senderWallet, recipient, amount) {
    //we can use balance of the sender wallet
    return [{ 
      address: senderWallet.publicKey, 
      ledgerEntry: new FlowCurrency(senderWallet.balance.token - amount, senderWallet.flow + amount)
    }, {
      address: recipient, 
      ledgerEntry: new FlowCurrency(amount, amount)
    }];
  }


  //functions copied from David Katz
  static rewardTransaction(minerWallet, blockchainWallet) {
    return new Transaction(blockchainWallet, minerWallet.publicKey, MINING_REWARD)
  }
  
  
}

module.exports = Transaction;