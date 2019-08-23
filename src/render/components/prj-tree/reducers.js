import {combineReducers} from 'redux'

const fileShow2Editor_Path = (state='', action) => {
  switch (action.type) {
    case 'SHOW_FILE_CONTENT': return action.payload;
    case 'HIDE_FILE_CONTENT': return '';
    default: return state
  }
}

export default combineReducers({
  fileShow2Editor_Path
})