import React from 'react';
import { inject, observer } from 'mobx-react';

import Card from './Card';

class PokerHand extends React.Component {
    render() {
        let store = this.props.cardStore || {};
        let storeCards = store.cards || [];
        let cards = storeCards.map((c) => <Card key={c.code} card={c} />);

        return <span className="PokerHand">{cards}</span>
    }
}

export default inject('cardStore')(observer(PokerHand));