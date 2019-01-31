import React, { Component } from 'react';
import './navbar.css';

import {Link} from 'react-router-dom';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            somestate: ''
        };
    }

    componentDidMount() {
    }

  render() {
    return (
          <header className="navbar">
          <Link to="/" className="title">HOOQ</Link>
          </header>
    );
  }
}

export default Navbar;
