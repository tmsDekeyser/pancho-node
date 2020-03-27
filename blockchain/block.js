const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY } = require('../config');

class Block{
    constructor(timestamp, lastHash, nonce, difficulty, hash, data) {
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
            Last hash:  ${this.lastHash.substring(0,10)}
            Nonce:      ${this.nonce}
            Difficulty: ${this.difficulty}
            Hash:       ${this.hash.substring(0,10)}
            Data:       ${this.data}`
    };

    static genisisBlock() {
        return new this('Big Bang', '-----', 0, DIFFICULTY, 'f1r57 h45h', []);
    }

    static mineBlock(lastBlock, data) {
        let time;
        let hash;
        let nonce = 0;

        do {
            nonce++;
            time = Date.now();
            hash = Block.hash(time, lastBlock.hash, nonce, DIFFICULTY, data);
        } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

        return new this(time, lastBlock.hash, nonce, DIFFICULTY, hash, data );
    }

    static hash(timestamp, lastHash, nonce, difficulty, data) {
        return SHA256(`${timestamp}${lastHash}${nonce}${difficulty}${data}`).toString();
    }

    static blockHash(block) {
        const { timestamp, lastHash, nonce, difficulty, data } = block;
        return Block.hash(timestamp, lastHash, nonce, difficulty, data);
    }
}

module.exports = Block;