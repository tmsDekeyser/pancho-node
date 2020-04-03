const CryptoUtil = require('../util/crypto-util');
const cryptoHash = require('../util/crypto-hash');
const FlowCurrency = require('./flow-currency');
const { MINING_REWARD, DIVIDEND} = require('../config');

class Transaction {
  constructor(senderWallet, recipient, amount) {
    this.id = CryptoUtil.id();
    this.output = this.createOutput(senderWallet, recipient, amount);
    this.input = this.createInput(senderWallet);
  }

  
  update(senderWallet, recipient, amount) {
    if (senderWallet.publicKey === 'DIVIDEND_BANK') {
      console.error("This is a dividend transaction! Pick another transaction.");
    } else {
    
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

      //return this;
    }
  }

  createInput(senderWallet) {
    return {
      time: Date.now(),
      tokenTotals: senderWallet.balance.token,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(this.output)
    };
  }

  createOutput(senderWallet, recipient, amount) {
    if (senderWallet.publicKey === 'DIVIDEND_BANK') {
      console.error('This is a dividend transaction! Pick another transaction.')
    } else {
      //we can use balance of the sender wallet
      return [{ 
        address: senderWallet.publicKey, 
        ledgerEntry: new FlowCurrency(senderWallet.balance.token - amount, senderWallet.balance.flow + amount)
      }, {
        address: recipient, 
        ledgerEntry: new FlowCurrency(amount, amount)
      }];
    }
  }


  static verifyTransaction(tx) {
    const outputTotalToken = tx.output.reduce((total, output) => {
      return total + output.ledgerEntry.token;
    }, 0);

    if (tx.input.tokenTotals !== outputTotalToken) {
      console.log(`Invalid transaction from ${tx.input.address}.`);
      return;
    };

    if (!CryptoUtil.verifySignature(
      tx.input.address,
      tx.input.signature,
      tx.output
    )) {
      console.log(`Invalid signature from ${tx.input.address}.`);
      return;
    };
    return true;
  }

}

module.exports = Transaction;