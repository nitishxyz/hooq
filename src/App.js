import React, { Component } from 'react';
import './App.css';
import Player from './screens/player';
import Home from './screens/home';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
      <Route
        path={process.env.PUBLIC_URL + '/hooq'}
        render={props => <Home {...props}/>}
        exact
      />
      <Route
        path={process.env.PUBLIC_URL + '/hooq/player/:id'}
        render={props => <Player {...props}/>}
      />
      </div>
      </Router>
    );
  }
}

export default App;
