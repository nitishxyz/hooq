import React, { Component } from 'react';
import './contitle.css';
import bigbuck from '../../assets/Big_buck_bunny_poster_big.jpg';

class ConTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            somestate: ''
        };
    }

    componentDidMount() {
        // console.log(this.props.nav.location)
        //  onClick={() => {this.props.nav.history.push("player/bunny")}}
    }

  render() {
    return (
        <div className="titleCon" onClick={() => {this.props.nav.history.push("player/bunny")}}>
        <img src={bigbuck} className="titlePic" alt={bigbuck}/>
        </div>
    );
  }
}

export default ConTitle;
