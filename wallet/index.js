const { STARTING_BALANCE } = require('../config');
const CryptoUtil = require('../crypto-util');

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        this.keyPair = CryptoUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    toString() {
        return(`Wallet -
            Address (public key): ${this.publicKey.toString()},
            Balance: ${this.balance}`
        );
    }
}

module.exports = Wallet;