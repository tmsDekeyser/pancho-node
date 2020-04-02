const CryptoUtil = require('../util/crypto-util');
const cryptoHash = require('../util/crypto-hash');
const FlowCurrency = require('./flow-currency');
const { MINING_REWARD, DIVIDEND} = require('../config');

class Transaction {
  constructor(senderWallet, recipient, amount) {
    this.id = CryptoUtil.id();
    this.output = Transaction.createOutput(senderWallet, recipient, amount);
    this.input = this.createInput(senderWallet);
  }

  
  update(senderWallet, recipient, amount) {
    if (senderWallet.publicKey === 'DIVIDEND_BANK') {
      return this.updateDividend(senderWallet, recipient, amount);
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

      return this;
    }
  }

  updateDividend(senderWallet, recipient, amount) {
    const senderOutput = this.output.find(output => output.address === senderWallet.publicKey);

      if (amount > senderOutput.ledgerEntry.token) {
        console.log(`Amount: ${amount} exceeds balance.`);
        return;
      }; // this should not happen

      senderOutput.ledgerEntry.token = senderOutput.ledgerEntry.token - amount;
      senderOutput.ledgerEntry.flow = 0;
      this.output.push({ ledgerEntry: new FlowCurrency(amount, 0), address: recipient });
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
      signature: senderWallet.sign(this.output)
    };
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


  static createOutput(senderWallet, recipient, amount) {
    if (senderWallet.publicKey === 'DIVIDEND_BANK') {
      return Transaction.createDividendOutput(senderWallet, recipient, amount);
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

  static createDividendOutput(senderWallet, recipient, amount) {
    return [{ 
      address: senderWallet.publicKey,  // can I leave this out?
      ledgerEntry: new FlowCurrency(senderWallet.balance.token - amount, 0)
    }, {
      address: recipient, 
      ledgerEntry: new FlowCurrency(amount, 0)
    }];
  }


  static dividendTransaction(bankWallet, blockchain) {
    let knownAddresses = blockchain.knownAddresses();
    knownAddresses.delete(bankWallet.publicKey);
    
    let dividendTxArray = [];
    
    bankWallet.balance.token = knownAddresses.size * DIVIDEND;

    for (let item of knownAddresses) {
      if (dividendTxArray.length < 1) {
        dividendTxArray.push( new Transaction(bankWallet, item, DIVIDEND) );
        //console.log(dividendTxArray);
      } else {
        let tx = dividendTxArray[0];
        //console.log(JSON.stringify(tx));
        dividendTxArray.pop();
        dividendTxArray.push(tx.update(bankWallet, item, DIVIDEND));
      };
      
    };

    return dividendTxArray[0];
    
  }
  
  
}

module.exports = Transaction;