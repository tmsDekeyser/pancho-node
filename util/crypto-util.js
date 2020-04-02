const EC = require('elliptic').ec;
const uuidV1 = require('uuid').v1; //deprecated
const ec = new EC('secp256k1');

class CryptoUtil {
    static genKeyPair() {
        
        return ec.genKeyPair();
    }

    static id() {
        return uuidV1();
    }
    
    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
    
}

module.exports = CryptoUtil;