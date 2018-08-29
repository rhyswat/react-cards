import axios from 'axios';
import _ from 'lodash';

const SERVER_URL = 'http://localhost:3001';

const prepareHand = function (storeCards) {
    let hand = _.filter(storeCards, card => card.value !== 'JOKER');
    hand.forEach(element => {
        delete element.image;
        delete element.images;
    });
    return hand;
}

class SyncAPI {
    /**
     * @param {Array} storeCards decoupled store cards -- mobx.toJs(store.cards)
     */
    sync(storeCards) {
        let cards = prepareHand(storeCards);

        return new Promise((resolve, reject) => {
            if (cards.length === 0) {
                return resolve({ response: 'empty hand' });
            }

            if (Boolean(fetch)) {
                console.log('Attempting sync with FETCH');
                return this.syncWithFetch(cards, resolve, reject);
            }

            if (Boolean(XMLHttpRequest)) {
                console.log('Attempting sync with AXIOS');
                return this.syncWithAxios(cards, resolve, reject);
            }

            reject('No suitable HTTP client library found');
        });
    }

    syncWithAxios(cards, resolve, reject) {
        axios.post(SERVER_URL, cards)
            .then(response => {
                console.log('[axios] POST response:', response.data, response.status);
                resolve({ response: response.data });
            }).catch(error => {
                reject(error);
            });
    }

    syncWithFetch(cards, resolve, reject) {
        let options = {
            method: 'POST',
            body: JSON.stringify(cards),
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        };
        
        let request = new Request(SERVER_URL, options);
        fetch(request)
            .then(response => {
                console.log('[fetch] POST response:', response);
                return response.text();
            }).then((text) => {
                resolve({ response: text });
            }).catch(error => {
                reject(error);
            });
    }
}

export default SyncAPI;