const PubNub = require('pubnub');

const keySet = {
    publishKey: 'pub-c-3ae6dace-fc08-4626-b254-d35955b15049',
    subscribeKey: 'sub-c-4cd913a4-74bc-11ea-b179-9eded212fb8b',
    secretKey: 'sec-c-MWJkNjFkZTQtYWQwNS00MDMzLWFlMGItZjk3MzU2NDk5MzNk'
}

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
                        this.transactionPool.updateOrAddTransaction(parsedMessage);
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
