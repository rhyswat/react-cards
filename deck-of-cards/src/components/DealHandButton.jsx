import React from 'react';
import { inject } from 'mobx-react';

class DealHandButton extends React.Component {

    constructor(props) {
        super(props);
        this.dealHand = this.dealHand.bind(this);
    }

    dealHand() {
        this.props.cardStore.drawCards();
    }

    render() {
        let state = this.props.cardStore.state || '';
        let isDealing = state === 'dealing';

        console.log('card table state:', state);
        return <button type="button" disabled={isDealing} onClick={this.dealHand}>Deal a hand of cards</button>
    }
}

export default inject('cardStore')(DealHandButton);