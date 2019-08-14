import {store} from '../render/store'

export default {
  dispatch: store.dispatch,
  subscribe: store.subscribe,
  getState: store.getState
}