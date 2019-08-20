var electron = window.electron
var { ipcRenderer } = electron
import ipc_channel from '../const/ipc_channel'

export default {
  getRepo: ({repoUrl, localFolder, cb}) => {
    ipcRenderer.send(ipc_channel.GET_REPO, {repoUrl, localFolder})

    ipcRenderer.on(ipc_channel.GET_REPO, (e, res) => {
      //console.log('ipcRebder res: ', res)
      cb(res)
    })
  },
  readDirAndFile: ({path,cb}) => {
    //console.log({path,cb})
    ipcRenderer.send(ipc_channel.READ_LOCAL_PATH, {path})

    ipcRenderer.on(ipc_channel.READ_LOCAL_PATH, (e, res) => {
      //console.log('ipcRebder res: ', res)
      cb(res)
    })
  },
  readLocalFile: ({path, cb}) => {
    console.log({path,cb})
    ipcRenderer.send(ipc_channel.READ_LOCAL_FILE, {path})

    ipcRenderer.on(ipc_channel.READ_LOCAL_FILE, (e, res) => {
      //console.log('ipcRebder res: ', res)
      cb(res)
    })
  },
  readRepoInfoFile: ({path, cb}) => {
    console.log({path,cb})
    ipcRenderer.send(ipc_channel.READ_LOCAL_REPO_INFO_FILE, {path})

    ipcRenderer.on(ipc_channel.READ_LOCAL_REPO_INFO_FILE, (e, res) => {
      //console.log('ipcRebder res: ', res)
      cb(res)
    })
  }
  /*
  getGithubUserInfo: (username) => {
    ipcRenderer.send(ipc_channel.GET_USER_INFO, {username})

    ipcRenderer.on(ipc_channel.GET_USER_INFO, (e, res) => {
     console.log('ipcRebder res: ', res)
    })
  },
  */
 /*
  getRepos: (username) => {
    ipcRenderer.send(ipc_channel.GET_REPOS, {username})

    ipcRenderer.on(ipc_channel.GET_REPOS, (e, res) => {
      console.log('ipcRebder res: ', res)
    })
  },
 */

  /*
  loginGithub: ({username, password}) => {
    ipcRenderer.send(ipc_channel.LOGIN_GITHUB, {username, password})

    ipcRenderer.on(ipc_channel.LOGIN_GITHUB, (e, res) => {

      console.log('ipcRebder res: ', res)

      let {id, token} = res

      window.localStorage.setItem('id', id)
      window.localStorage.setItem('token', token)

    })
  }
  */
}

