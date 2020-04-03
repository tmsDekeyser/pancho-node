const { DIFFICULTY } = require('../config');
const cryptoHash = require('../util/crypto-hash');

class Block{
    constructor({ timestamp, lastHash, nonce, difficulty, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.nonce = nonce;
        this.difficulty = difficulty;
        this.hash = hash;
        this.data = data;
    };

    toString () {
        return `
        Block - 
            Timestamp:  ${this.timestamp}
            Last hash:  ${this.lastHash.substring(0,10)}...
            Nonce:      ${this.nonce}
            Difficulty: ${this.difficulty}
            Hash:       ${this.hash.substring(0,10)}...
            Data:       ${this.data}`
    };

    static genisisBlock() {
        return new this({ timestamp: 1000000, 
        lastHash : '-----', 
        nonce : 0, 
        difficulty : DIFFICULTY, 
        hash: 'f1r57 h45h', 
        data: [] });
    }

    static mineBlock(lastBlock, data) {
        let time;
        let hash;
        let nonce = 0;

        do {
            nonce++;
            time = Date.now();
            hash = cryptoHash(time, lastBlock.hash, nonce, DIFFICULTY, data);
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this({ hash, nonce, data, timestamp: time, lastHash: lastBlock.hash, difficulty: DIFFICULTY } );
    }

}


module.exports = Block;