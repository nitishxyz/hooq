import React, { Component } from 'react';
import './home.css';
import Navbar from './ui/navbar';
import ConTitle from './ui/contitle';

import {Link} from 'react-router-dom';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            somestate: ''
        };
    }

    componentDidMount() {
        // console.log(this.props.history)
    }

  render() {
    return (
        <div className="home">
          <Navbar />
          <div className="conTitles">
          <div className="conTitle">
          <ConTitle nav={this.props}/>
          </div>
          <div className="conTitle">
          <ConTitle nav={this.props}/>
          </div>
          </div>
      </div>
    );
  }
}

export default Home;
