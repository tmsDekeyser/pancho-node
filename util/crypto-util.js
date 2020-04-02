const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');
const uuidV1 = require('uuid').v1; //deprecated
const ec = new EC('secp256k1');

class CryptoUtil {
    static genKeyPair() {
        
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }
    
    static verifySignature(publicKey, signature, data) {
        return ec.keyFromPublic(publicKey, 'hex').verify(cryptoHash(data), signature);
    }
    
}

module.exports = CryptoUtil;