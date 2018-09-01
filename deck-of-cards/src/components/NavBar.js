import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return (
            <div className="NavBar">
                <ul>
                    <li>
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/cards">Card game</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">About</NavLink>
                    </li>
                </ul>
            </div>
        );
    }
}

export default NavBar;