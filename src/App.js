import React, { Component } from 'react';
import './App.css';
import Player from './screens/player';
import Home from './screens/home';
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
      <Route
        path="/"
        render={props => <Home {...props}/>}
        exact
      />
      <Route
        path="/player/:id"
        render={props => <Player {...props}/>}
      />
      </div>
      </Router>
    );
  }
}

export default App;
