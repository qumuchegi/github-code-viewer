import {combineReducers} from 'redux'

const fileShow2Editor_Path = (state='', action) => {
  switch (action.type) {
    case 'SHOW_FILE_CONTENT': return action.payload;
    default: return state
  }
}

export default combineReducers({
  fileShow2Editor_Path
})