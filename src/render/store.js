import {combineReducers} from 'redux';
import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import headerReducer from './components/header/reducers'
import prjTreeReducer from './components/prj-tree/reducers'

export const store = createStore( combineReducers({
  headerReducer,
  prjTreeReducer
 }), applyMiddleware(thunk)
)