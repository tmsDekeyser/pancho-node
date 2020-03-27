const CryptoUtil = require('../crypto-util');

class Transaction {
    constructor() {
        this.id = CryptoUtil.id();
        this.input = 0;
        this.output = 0;
    }


}