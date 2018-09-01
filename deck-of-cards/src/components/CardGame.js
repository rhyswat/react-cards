import React, { Component } from 'react';

import CardTable from './CardTable';

class CardGame extends Component {
    render() {
        return (
            <div className="App">
                <h2>Card game</h2>
                <CardTable />
            </div>
        );
    }
}


export default CardGame;