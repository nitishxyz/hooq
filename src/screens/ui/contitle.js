import React, { Component } from 'react';
import './contitle.css';
import bigbuck from '../../assets/Big_buck_bunny_poster_big.jpg';
import {Link} from 'react-router-dom';

class ConTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            somestate: ''
        };
    }

    componentDidMount() {
        // console.log(this.props.nav.location)
    }

  render() {
    return (
        <a href="/hooq/player/bunny">
        <div className="titleCon">
      <img src={bigbuck} className="titlePic" />
      </div>
        </a>
    );
  }
}

export default ConTitle;
