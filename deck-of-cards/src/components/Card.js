import React, { Component } from 'react';

class Card extends Component {

    render() {
        return (
            <span className="Card">
                <img alt={this.props.card.code} src={this.props.card.image} />
            </span>
        );
    }
}

export default Card;