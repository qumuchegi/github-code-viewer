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
  })
}