import React, { Component } from 'react';
import './App.css';

class App extends Component {
	handleOnClick = () => {
		this.props.store.dispatch({
		  type: 'INCREASE_COUNT',
		});
	  }

	render() {
		const state = this.props.store.getState();
		return (
			<div className="App">
				<button onClick={this.handleOnClick}>Click</button>
				<p>{state.clicks}</p>
			</div>
		);
	}
}

export default App;
