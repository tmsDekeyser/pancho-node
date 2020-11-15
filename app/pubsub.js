const PubNub = require('pubnub');
const Wallet = require('../wallet');
const keySet = require('./secretKey');


const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION',
    CLEAR_TX: 'CLEAR_TX'
}

class PubSub {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.pubnub = new PubNub(keySet);

        this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

        this.pubnub.addListener(this.listener());
    }
    
    listener() {
        return {
            message: messageObject => {
                const { message, channel } = messageObject;

                console.log(`Message received. Channel: ${channel}. Message: ${message}`);

                const parsedMessage = JSON.parse(message);

                switch(channel) {
                    case CHANNELS.BLOCKCHAIN :
                        this.blockchain.replaceChain(parsedMessage);
                        break;
                    case CHANNELS.TRANSACTION :
                        const transaction = Wallet.transactionFromData(parsedMessage);
                        this.transactionPool.updateOrAddTransaction(transaction);
                        break;
                    case CHANNELS.CLEAR_TX:
                        this.transactionPool.clear();
                    default:
                        return;
                    
                }
            }
        };
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message });
    };

    broadcastChain() {
        this.publish({channel: CHANNELS.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain)});
    };

    broadcastTransaction (transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    };

    broadcastClearTransactions() {
        this.publish({
            channel: CHANNELS.CLEAR_TX,
            message: JSON.stringify("Hey, time to clear you mempool, bud!")
        })
    }


}

module.exports = PubSub;
