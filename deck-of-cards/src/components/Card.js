import React, { Component } from 'react';

class Card extends Component {

    render() {
        let component = <img alt={this.props.card.code} src={this.props.card.image}/>;
        return <span className="Card">{component}</span>
    }
}

export default Card;