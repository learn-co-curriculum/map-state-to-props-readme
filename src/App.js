import React, { Component } from "react";
import "./App.css";

class App extends Component {
  handleOnClick() {
    this.props.dispatch({
      type: "INCREASE_COUNT"
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={event => this.handleOnClick()}>Click me bitch</button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
}

export default App;
