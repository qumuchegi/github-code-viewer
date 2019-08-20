import utils from '../../../utils'
let { dispatch }= utils.storeUtils

import actions from './actions'
let {storeNewRepo, storeHistoryRepo, showRepoContent, removeARepo, hideRepoById, addLocalRepo, hideRepoByPath} = actions

export default {
  dispatch_storeNewRepo: (action_payload) => {
    dispatch(storeNewRepo(action_payload))
  },
  dispatch_storeHistoryRepos: (action_payload) => {
    dispatch(storeHistoryRepo(action_payload))
  },
  dispatch_showRepoContent: (action_payload) => {
    dispatch(showRepoContent(action_payload))
  },
  dispatch_removeARepo: (action_payload) => {
    dispatch(removeARepo(action_payload))
  },
  dispatch_hideRepo_byId: (action_payload) => {
    dispatch(hideRepoById(action_payload))
  },
  dispatch_addLocalRepo: (action_payload) => {
    dispatch(addLocalRepo(action_payload))
  },
  dispatch_hideRepo_byPath: (action_payload) => {
    dispatch(hideRepoByPath(action_payload))
  },
}