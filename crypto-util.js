const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');

class CryptoUtil {
    static genKeyPair() {
        return EC.KeyPair();
    }

    static id() {
        return uuidV1();
    }
    
}

module.exports = CryptoUtil;