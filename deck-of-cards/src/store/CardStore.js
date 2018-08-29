import { action, extendObservable } from 'mobx';
import _ from 'lodash';

import placeholder from '../assets/placeholder.png';

class CardStore {
    constructor(api) {
        this.api = api;

        extendObservable(this, {
            state: 'empty-hand',
            cards: [],

            drawCards: action(function () {
                this.cards = this.placeholderHand(5);
                this.state = 'dealing';
                this.api.drawCards()
                    .then(
                        action(response => {
                            this.cards = response.cards;
                            this.state = 'done';
                        }),
                        action(error => {
                            this.cards = [];
                            this.state = JSON.stringify(error);
                        })
                    )
            })
        })
    }

    placeholderHand(howMany) {
        return _.times(howMany, (index) => {
            return {
                image: placeholder,
                value: 'JOKER',
                suite: 'N/A',
                code: 'J' + index
            };
        });
    }
}

export default CardStore;