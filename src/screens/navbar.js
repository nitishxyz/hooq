import React, { Component } from 'react';

import {Link} from 'react-router-dom';

class Home extends Component {
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
        <div style={{flexDirection: "column"}}>
          HOME
          <Link to="/">Home</Link>
          <Link to="/player">Player</Link>
      </div>
    );
  }
}

export default Home;
