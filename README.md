### Summary

When we last left off, we successfully used our __createStore()__ method, and
integrated the method into our __React__ application to update our state.
Unfortunately, our __React__ application did not re-render in response to
changes in the state. In this lesson, we'll fix that.

## Use the Provider component from React Redux

The reason why the application did not re-render previously is because our
__React__ and __Redux__ libraries could not properly communicate to each 
other to specify that a change in the store's state occurred. Luckily, we
can use the __React Redux__ library to get React and Redux talking to one
another. Run `npm install react-redux --save` to install it and add it to our
`package.json`.

The __React Redux__ library gives us access to a component called the __Provider__.
This component does two things for us. First, it will make the store available
to nested components, once they have been configured using a second method 
provided by the __React Redux__ library, __connect()__. More on that later. The 
second thing it does for us is to alert our __Redux__ app when there has been 
a change in state, which will then re-render our __React__ app. 

Let's give it a shot. The first step in getting it working is to import __Provider__
from __React Redux__ then wrap the __Provider__ component around our `App` component. 
Let's add the following code to our `src/index.js` file:

```javascript
// ./src/index.js

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux'; /* code change */
import shoppingListItemReducer from './reducers/shoppingListItemReducer';
import App from './App';
import './index.css';

const store = createStore(
  shoppingListItemReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, /* code change */
  document.getElementById('root')
);
```

We just did a few things here:

* We imported `Provider` from __React Redux__
* We used `Provider` to wrap our React application
* Instead of passing our store instance directly into the __App__ component, we 
are now passing it into `Provider` as a prop, which will make it available to 
all of our other components (after some additional configuration).


### Step 2: Connecting The Container Component to Store

Using the `<Provider>` component provided by the __React Redux__ library, we
gave our components *the ability to be connected to the store*. However, we
don't want every component re-rendering in response to every change in the
state. So the __React Redux__ library requires us to specify which changes to
the store's state should prompt a re-render of the application. We will specify
this with the __connect()__ function.

#### Using the `connect()` function

Connecting a component to the store means that it will be able to get data from
the store's internal state. It also means that it will be told to re-render and 
get new data when that state changes. 

Let's open up `./src/App.js` so we can get the __App__ componenet connected. First, 
we need to import the __connect()__ function from __React Redux__: 

```javascript
//./src/App.js

import React, { Component } from 'react';
import { connect } from 'react-redux'; /* code change */
import './App.css';

...
```

Next, we need to modify our `render` and `handleOnClick` methods to reflect the 
fact that the store is no longer being passed directly to __App__ from `index.js`:


```javascript
...

class App extends Component {

  handleOnClick() {
    this.props.dispatch({ 
      type: 'INCREASE_COUNT',
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.handleOnClick()}>
          Click
        </button>
        <p>{this.props.items.length}</p> 
      </div>
    );
  }
};

...
```

Finally, let's create a new method, `mapStateToProps`, and use __connect__ to 
wire everything together:


```javascript
...

const mapStateToProps = (state) => {
  return { items: state.items };
};

export default connect(mapStateToProps)(App);
```

Holy cow those last few lines are confusing. Let's see if we can understand
them. Remember, that we have two goals here: (a) to only re-render our __App__
component when specific changes to the state occur, and (b) to only provide the
slice of the state that we need to our __App__ component. So we will need (1) a
function that listens to every change in the store and then (2) filters out the
changes relevant to a particular component to (3) provide to that component.
That's exactly what's happening here. Let's go through what is doing what.

```javascript
export default connect(mapStateToProps)(App);
```

The connect function is taking care of task 1, it is synced up to our store,
listening to each change in the state that occurs. When a change occurs, it
calls a function *that we write* called __mapStateToProps()__, and in
__mapStateToProps()__ we specify exactly which slice of the state we want to
provide to our component. Here, we want to provide `state.items`, and allow our
component to have access to them through a prop called items. We are then able 
to access the items in our `render` method using `this.props.items`. So that 
completes task 2. 

Next we have to say which component in our application we are providing this 
data to: you can see that we write `connect(mapStateToProps)(App)` to specify 
that we are connecting this state to the __App__ component. In the end, the 
__connect()__ method returns a new component which looks like the __App__ 
component we wrote, but is connected up to receive the correct data. This new
component is the component we wish to export. So at the bottom of the file, 
you see:

```javascript
const mapStateToProps = (state) => {
  return { items: state.items };
};

export default connect(mapStateToProps)(App);
```

**Note:** We didn't have to import anything to define a __mapStateToProps()__ 
function! We wrote that function ourselves.

Finally, in our __mapStateToProps()__ function we are saying that we are
providing a new prop called items, so in our __App__ component, that is the prop
we want to reference.

Once we've made all the changes, the final code should look like this:

```javascript
// ./src/App.js

import React, { Component } from 'react';
import { connect } from 'react-redux'; /* code change */
import './App.css';

class App extends Component {

  handleOnClick() {
    this.props.dispatch({
      type: 'INCREASE_COUNT',
    });
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.handleOnClick()}>
          Click
        </button>
        <p>{this.props.items.length}</p>
      </div>
    );
  }
};

// start of code change
const mapStateToProps = (state) => {
  return { items: state.items };
};

export default connect(mapStateToProps)(App);
// end of code change
```


Ok, __mapStateToProps()__ and __connect()__ is very confusing; we'll be digging
through it more in upcoming lessons.  But for now, let's boot up our application, 
click the button, and verify that we can finally get our application to re-render. 


#### A Note on `dispatch`

In the example code for App, you may have noticed something odd:

```js
  handleOnClick() {
    this.props.dispatch({
      type: 'INCREASE_COUNT',
    });
  }
```

We have a prop named dispatch! But where did it come from if it's a prop? We 
will go into greater detail later, but `dispatch` is automatically provided
by `connect` if it is missing a _second_ argument. That second argument is
reserved for `mapDispatchToProps`, which allows us to customize how we send
actions to our reducer. Without the second argument we will still be able to
use `dispatch` on any component wrapped with `connect`.

## Conclusion

We learned of two new pieces of __React Redux__ middleware: __connect()__ and
__Provider__.  The two pieces work hand in hand. __Provider__ ensures that our
entire React application can potentially access data from the store. Then
__connect()__, allows us to specify which data we are listening to (through
mapStateToProps), and which component we are providing the data to. So when 
you see lines like this:

```javascript
const mapStateToProps = (state) => {
  return { items: state.items };
};

connect(mapStateToProps)(App);
```

That is saying connect the data in __mapStateToProps()__ (the items portion of
the state) to the __App__ component. And the __App__ component can access that
state with `this.props.items`. 

Don't fret if you still feel hazy on __connect()__ and __mapStateToProps()__. 
This is a new middleware api that takes time to learn. We won't introduce any 
new material in the next code along, we'll just try to deepen our understanding 
of the material covered in this section. First, please take at least a 15 minute 
break before moving on.  
