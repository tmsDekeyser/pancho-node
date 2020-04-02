const Transaction = require('./transaction');
const FlowCurrency = require('./flow-currency');
const { DIVIDEND } = require('../config');


class DividendTx extends Transaction {
    constructor(senderWallet, recipient) {
        super(senderWallet, recipient, DIVIDEND);
    };

    // createOutput(senderWallet, recipient, amount) {
    //     return super(senderWallet, recipient, amount).forEach(entry => entry.ledgerEntry.flow = 0);
    // };

    // update(senderWallet, recipient, amount) {
    //     super(senderWallet, recipient, amount).output.filter(output => {
    //         return (output.address ==== senderWallet.publicKey) || (output.address === recipient);
    //     }).forEach(output => output.ledgerEntry.flow = 0);
    //     this.createInput(senderWallet);

    //     return this;
        
    // };

    createOutput(senderWallet, recipient, amount) {
        return [{ 
          address: senderWallet.publicKey,  // can I leave this out?
          ledgerEntry: new FlowCurrency(senderWallet.balance.token - amount, 0)
        }, {
          address: recipient, 
          ledgerEntry: new FlowCurrency(amount, 0)
        }];
    };

   

    update(senderWallet, recipient, amount = DIVIDEND) {
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
      };

      
}



module.exports = DividendTx;