import {combineReducers} from 'redux'

const repos = (state=[], action) => {
  switch (action.type) {
    case 'STORE_NEW_REPO_INFO': return [...state, action.payload];
    case 'STORE_HISTORY_REPOS_INFO': return [...state, ...action.payload]
    case 'CLEAR_REPO_INFO': return [];
    case 'REMOVE_A_REPO': 
      let newRepos = state.filter(el => el.repoID !== action.payload)
      console.log('删除后：', newRepos)
      return newRepos;
    default: return state
  }
}

const repoIDWillShowContent = (state='', action) => {
  switch (action.type) {
    case 'SHOW_REPO_CONTENT': 
      return action.payload;
    case 'HIDE_REPO_CONTENT_BY_ID':
      return '';
    default: return state;
  }
}

const localRepoDirPath = (state="", action) => {
  switch (action.type) {
    case "ADD_DIR_REPO": return action.payload;
    case "HIDE_REPO_CONTENT_BY_PATH": return "";
    default: return state;
  }
}

export default combineReducers({
  repos,
  repoIDWillShowContent,
  localRepoDirPath
})