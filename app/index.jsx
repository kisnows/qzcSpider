/**
 * @author hzyuanqi1
 * @create 2016/8/3.
 */
import React from "react";
import {render} from "react-dom";
import App from "./containers/App";
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import reducer from "./reducers";


const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

console.log(store.getState())
store.subscribe(()=> {
  console.log('store', store.getState())
})

const root = document.getElementById('root')

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  root
)
