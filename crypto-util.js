const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');

class CryptoUtil {
    static genKeyPair() {
        return EC.KeyPair();
    }

    static id() {
        return uuidV1();
    }

    static hash(data) {
        return SHA256(JSON.stringify(data)).toString();
    }
    
    static verifySignature(publicKey, signature, dataHash) {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }
    
    
}

module.exports = CryptoUtil;