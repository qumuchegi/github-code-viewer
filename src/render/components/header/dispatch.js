import utils from '../../../utils'
let { dispatch }= utils.storeUtils

import actions from './actions'
let {storeNewRepo, storeHistoryRepo, showRepoContent} = actions

export default {
  dispatch_storeNewRepo: (action_payload) => {
    dispatch(storeNewRepo(action_payload))
  },
  dispatch_storeHistoryRepos: (action_payload) => {
    dispatch(storeHistoryRepo(action_payload))
  },
  dispatch_showRepoContent: (action_payload) => {
    dispatch(showRepoContent(action_payload))
  }
}