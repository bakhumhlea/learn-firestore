import React, { Component } from 'react';
import Todo from './components/Todo';
import Clock from './components/Clock';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="container">
          <div  className="row">
            <Clock/>
          </div>
          <div  className="row">
            <Todo />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
