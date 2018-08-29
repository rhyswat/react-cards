import { autorun, toJS } from 'mobx';
import localforage from 'localforage';

import SyncAPI from '../api/SyncAPI';


// syncs to the server directly
const DirectSync = function (store) {
    console.log('Setting up direct sync');

    const syncAPI = new SyncAPI();
    autorun(() => {
        let cards = toJS(store.cards);
        syncAPI.sync(cards)
            .then(resp => {
                console.log(resp);
            })
            .catch(err => {
                console.error(err);
            });
    });
}

// syncs to the server indirectly via a service worker event
const StorageKey = 'deck-of-cards-sync';
const ServiceWorkerSync = function (store) {
    console.log('Setting up service worker sync');

    autorun(() => {
        let cards = toJS(store.cards);

        // write to indexdb then notify that a sync is ready
        localforage.setItem(StorageKey, cards).then(() => {
            return navigator.serviceWorker.ready;
        }).then(function (registration) {
            return registration.sync.register('hand-of-cards');
        }).catch(error => {
            // not all browsers support this adequately
            console.error(error);
        });
    })
}

export {
    DirectSync,
    ServiceWorkerSync,
    StorageKey
};