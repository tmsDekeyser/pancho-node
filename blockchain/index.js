const Block = require('./block.js');

class Blockchain{
    constructor () {
        this.chain = [Block.genisisBlock()]; 
    }

    addBlock(data) {
        const block = Block.mineBlock(this.chain[this.chain.length-1], data);

        this.chain.push(block);
        return block;
    }

    replaceChain (incomingChain) {
        //incomingChain is a chain (array) of blocks, not a Blockchain object!
        if (incomingChain.length <= this.chain.length) {
            console.error("The incoming chain is not longer than the current Blockchain.");
            return;
        }

        if (Blockchain.isValidChain(incomingChain) !== true) {
            console.error("The incoming chain is not a valid Blockchain.");
            return;
        }

        this.chain = incomingChain;
        console.log("Replacing the local blockchain with the incoming chain.")
    }

    static isValidChain(incomingChain) {
        //incomingChain is a chain (array) of blocks, not a Blockchain object!
        if (JSON.stringify(incomingChain[0]) !== JSON.stringify(Block.genisisBlock())) {
            console.log("Problemen met genesis block.");
            return false;
        }

        for (let i=1; i < incomingChain.length; i++) {
            const block = incomingChain[i];
            const lastBlock = incomingChain[i-1];
            const { timestamp, lastHash, nonce, difficulty, data } = block;

            if (block.lastHash !== lastBlock.hash || 
                cryptoHash(timestamp, lastHash, nonce, difficulty, data) !== block.hash) {
                console.log("Problemen met hashes");
                return false;
            }
        }

        return true;
    }

    knownAddresses() {
        let knownAddresses = new Set();
        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            block.data.forEach(tx => {
                tx.output.forEach(entry => {
                    //console.log(entry.address);
                    knownAddresses.add(entry.address);
                });
            });

        };
        return knownAddresses;
    }


}

module.exports = Blockchain;

