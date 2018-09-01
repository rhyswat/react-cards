import React from 'react';
import { inject } from 'mobx-react';

import DealHandButton from './DealHandButton';
import PokerHand from './PokerHand';

class CardTable extends React.Component {

    render() {
        return (
            <div className="CardTable">
                <div><DealHandButton /></div>
                <div><PokerHand /> </div>
            </div>
        );
    }
}

export default inject('cardStore')(CardTable);