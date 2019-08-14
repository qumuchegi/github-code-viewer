import storeUtils from '../../../utils/store'

let {getState} = storeUtils

export default {
  getRepoInfoFromRedux: (repoID) => {
    return getState().headerReducer.repos.filter(repo => repo.repoID === repoID)[0]
  },
  getAllReposInfoFromRedux: () => {
    return getState().headerReducer.repos
  },
  getRepoIDWillShowContent: () => {
    return getState().headerReducer.repoIDWillShowContent
  },
  getFilePathShowing: () => {
    return getState().prjTreeReducer.fileShow2Editor_Path
  }
}