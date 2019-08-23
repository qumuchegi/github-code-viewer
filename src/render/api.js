var electron = window.electron
var { ipcRenderer } = electron
import ipc_channel from '../const/ipc_channel'

export default {
  loginGithub: ({username, password, cb}) => { // 登录 github 以创建一个 token
    ipcRenderer.send(ipc_channel.LOGIN_GITHUB, {username, password})

    ipcRenderer.on(ipc_channel.LOGIN_GITHUB, (e, res) => {

      console.log('ipcRebder res: ', res)

      cb(res)

    })
  },
  logoutGithub: ({username, password, id, cb}) => {
    ipcRenderer.send(ipc_channel.LOGOUT_GITHUB, {username, password, id})

    ipcRenderer.on(ipc_channel.LOGOUT_GITHUB, (e, res) => {
      cb(res)
    })
  },
  getRepo: ({repoUrl, localFolder, token, cb}) => {
    ipcRenderer.send(ipc_channel.GET_REPO, {repoUrl, localFolder, token})

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
  
}

