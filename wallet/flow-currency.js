const { STARTING_BALANCE } = require('../config');

class FlowCurrency {
    constructor(token, flow) {
        this.token = token || STARTING_BALANCE;
        this.flow = flow || 0;
    }

    toString() {
        return `${this.token} | ${this.flow}`;
    }
}

module.exports = FlowCurrency;