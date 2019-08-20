export default {
  storeNewRepo: (repoInfo) => ({
    type: 'STORE_NEW_REPO_INFO',
    payload: repoInfo
  }),
  storeHistoryRepo: (repoInfos) => ({
    type: 'STORE_HISTORY_REPOS_INFO',
    payload: repoInfos
  }),
  showRepoContent: (repoID) => ({
    type: 'SHOW_REPO_CONTENT',
    payload: repoID
  }),
  removeARepo: (repoID) => ({
    type: 'REMOVE_A_REPO',
    payload: repoID
  }),
  hideRepoById: (repoID) => ({
    type: 'HIDE_REPO_CONTENT_BY_ID',
    payload: repoID
  }),
  hideRepoByPath: (repoPath) => ({
    type: 'HIDE_REPO_CONTENT_BY_PATH',
    payload: repoPath
  }),
  addLocalRepo: (dirPath) => ({
    type: 'ADD_DIR_REPO',
    payload: dirPath
  })
}