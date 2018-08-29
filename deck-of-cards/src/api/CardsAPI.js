import axios from 'axios';

class CardsAPI {
    // each deal takes out of a deck
    remaining = 52;
    deckId = 'new';

    /**
     * https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=2
     * 
     * @param {Integer} howMany cards in this hand.
     */
    drawCards(howMany) {
        howMany = howMany || 5;
        if (this.remaining < howMany) {
            this.deckId = 'new';
        }

        let url = 'https://deckofcardsapi.com/api/deck/' + this.deckId + '/draw/?count=' + howMany;
        return new Promise((resolve, reject) => {
            axios.get(url)
                .then(response => {
                    this.deckId = response.data.deck_id;
                    this.remaining = response.data.remaining;
                    resolve({
                        error: null,
                        cards: response.data.cards
                    })
                })
                .catch(error => {
                    reject({
                        error: error,
                        cards: []
                    })
                })
        })
    }
}
export default CardsAPI;