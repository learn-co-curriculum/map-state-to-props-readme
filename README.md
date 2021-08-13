# Map State to Props

## Summary

When we last left off, we successfully used our **createStore()** method, and
integrated the method into our **React** application to update our state.
Unfortunately, our **React** application did not re-render in response to
changes in the state. In this lesson, we'll fix that.

## Use the Provider component from React Redux

The reason why the application did not re-render previously is because our **React** 
and **Redux** libraries could not properly communicate to each other to specify 
that a change in the store's state occurred. Luckily, we can use the 
**React Redux** library to get React and Redux talking to one another. The 
`redux` and `react-redux` packages are already included in this lesson's 
`package.json` file, so all you need to do is run `npm install && npm start` 
to get started.

The **React Redux** library gives us access to a component called the **Provider**.
This component does two things for us. First, it will make the store available
to nested components once they have been configured using a second method 
provided by the **React Redux** library, **connect()** — more on that later. The 
second thing it does for us is to alert our **Redux** app when there has been 
a change in state, which will then re-render our **React** app. 

The first step in getting it working is to import **Provider** from **React Redux**
then wrap the **Provider** component around our **App** component. 

Let's add the following code to our `src/index.js` file:

```jsx
// ./src/index.js

import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux"; /* code change */
import counterReducer from "./reducers/counterReducer.js";
import App from "./App";
import "./index.css";

const store = createStore(
  counterReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
); 

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider> /* code change */,
  document.getElementById("root")
);

```

We just did a few things here:

- We imported `Provider` from React Redux
- We used `Provider` to wrap our React application
- Instead of passing our store instance directly into the **App** component, we 
are now passing it in to `Provider` as a prop, which will make it available to 
other components (after some additional configuration).

### Step 2: Connecting The Container Component to Store

Using the `<Provider>` component provided by the **React Redux** library, we
gave our components _the ability to be connected to the store_. However, we
don't want every component re-rendering in response to every change in the
state. So the **React Redux** library requires us to specify which changes to
the store's state should prompt a re-render of the application. We will specify
this with the **connect()** function.

#### Using the `connect()` function

Connecting a component to the store means that it will be able to get data from
the store's internal state. It also means that it will be told to re-render and 
get new data when that state changes. 

Let's open up `./src/App.js` so we can get the **App** componenet connected. First, 
we need to import the **connect()** function from **React Redux**:

```jsx
// ./src/App.js

import React, { Component } from "react";
import { connect } from "react-redux"; /* code change */
import "./App.css";

...
```

Next, we need to modify our `render` and `handleOnClick` methods to reflect the 
fact that the store is no longer being passed directly to **App** from `index.js`:


```jsx
...

class App extends Component {

	handleOnClick = () => {
		this.props.dispatch({
		  type: "INCREASE_COUNT",
		});
	}

	render() {
		return (
			<div className="App">
				<button onClick={this.handleOnClick}>Click</button>
				<p>{this.props.clicks}</p> {/* code change */}
			</div>
		);
	}
}

...
```

Finally, let's create a new method, `mapStateToProps`, and modify our export 
statement to use **connect** to wire everything together:


```jsx
...

const mapStateToProps = (state) => {
	return { clicks: state.clicks };
};
  
export default connect(mapStateToProps)(App);
```

Holy cow those last few lines are confusing. Let's see if we can understand
them. Remember that we have two goals here: (a) to only re-render our **App**
component when specific changes to the state occur, and (b) to only provide the
needed slice of the state to our **App** component. So we will need (1) a
function that listens to every change in the store and then (2) accesses the
changes relevant to a particular component to (3) provide to that component.
That's exactly what's happening here. Let's go through what is doing what.

```jsx
export default connect(mapStateToProps)(App);
```

The connect function is taking care of task 1; it is synced up to our store,
listening to each change in the state that occurs. When a change occurs, it
calls a function _that we write_ called **mapStateToProps()**, and in
**mapStateToProps()** we specify exactly which slice of the state we want to
provide to our component. Here, we want to provide `state.clicks`, and allow our
component to have access to them through a prop called clicks. We are then able 
to render the number of clicks in our `render` method using `this.props.clicks`. 
So that completes task 2. 

Next we have to say which component in our application we are providing this 
data to. You can see that we write `connect(mapStateToProps)(App)` to specify 
that we are connecting this state to the **App** component. In the end, the 
**connect()** method returns a new component which looks like the **App**
component we wrote, but is connected up to receive the correct data. This new
component is the component we wish to export. 

**Note:** We didn't have to import anything to define a **mapStateToProps()** 
function! We wrote that function ourselves.

Once we've made all the changes, our final code should look like this:

```jsx
// ./src/App.js

import React, { Component } from "react";
import { connect } from "react-redux"; 

import "./App.css";

class App extends Component {

	handleOnClick = () => {
		this.props.dispatch({
		  type: "INCREASE_COUNT",
		});
	}

	render() {
		return (
			<div className="App">
				<button onClick={this.handleOnClick}>Click</button>
				<p>{this.props.clicks}</p>
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	return { clicks: state.clicks };
};
  
export default connect(mapStateToProps)(App);

```

There's a lot to absorb here about using **mapStateToProps()** and **connect()**;
we'll be digging through it more in upcoming lessons.  But for now, let's boot up
our application, click the button, and verify that we can finally get our
application to re-render. 

#### A Note on `dispatch`

In the example code for **App**, you may have noticed something odd:

```js
handleOnClick = () => {
  this.props.dispatch({
    type: "INCREASE_COUNT",
  });
}
```

We have a prop named dispatch! But where did it come from if it's a prop? We
will go into greater detail later, but `dispatch` is automatically provided
by `connect` if `connect` is missing its _second_ argument. That second
argument is reserved for `mapDispatchToProps`, which allows us to customize
how we send actions to our reducer. But even without the second argument, we
will still be able to use `dispatch` on any component wrapped with `connect`.

## Conclusion

We learned of two new pieces of **React Redux** middleware: **connect()** and
**Provider**. The two pieces work hand in hand. **Provider** ensures that our
entire React application can potentially access data from the store. Then
**connect()**, allows us to specify which data we are listening to (through
mapStateToProps), and which component we are providing the data to. So when 
you see lines like this:

```jsx
const mapStateToProps = (state) => {
  return { clicks: state.clicks };
};

connect(mapStateToProps)(App);
```

This is saying connect the data in **mapStateToProps()** (the clicks portion of
the state) to the **App** component. And the **App** component can access that
state with `this.props.clicks`. 

Don't fret if you still feel hazy on **connect()** and **mapStateToProps()**. 
This is a new middleware api that takes time to learn. We won't introduce any 
new material in the next code along, we'll just try to deepen our understanding 
of the material covered in this section. First, please take at least a 15 minute 
break before moving on.
