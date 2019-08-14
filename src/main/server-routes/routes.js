var github = require('octonode')
var ipc_channel = require('../../const/ipc_channel')
const {github_token} = require('../../config')

const {getABranchContent, readLocalDir_OR_FileWithPath, readAFile} = require('./middleweres')

module.exports = {
  [ipc_channel.GET_REPO]: ({params, cb}) => {
    let resBody
    const {repoUrl, localFolder} = params
    let client = github.client(github_token)
    let [,,,username, reponame] = repoUrl.split('/')
    reponame = reponame.replace(/\.git/,'')
    let username_reponame = [username,reponame].join('/')
    console.log(username_reponame)
  
    client.get('repos/' + username_reponame, {}, (err, status, body) => { // 获取仓库基本信息
      if (err) throw(err)
      else if (status === 200) {
        let {
          has_projects, id: repoID, name: repoName,
          owner, description, fork: isForkedFromOther, created_at,
          updated_at, pushed_at, homepage,
          watchers_count, language, forks_count,
          default_branch
        } = body

        let {
          login: repoOwner, id: ownerID, avatar_url: ownerAvatar,
        } = owner

        resBody = {
          has_projects, repoID, repoName,
          description, isForkedFromOther, created_at,
          updated_at, pushed_at, homepage,
          watchers_count, language, forks_count,
          default_branch, repoOwner, ownerID, ownerAvatar
        }

        client.get('repos/' + username_reponame + '/branches', {},  (err, status, body, headers) => { // 获取所有分支数组
          if (err) throw err
          else if(status === 200) {
            resBody = {...resBody, branches: body}

            getABranchContent({username_reponame, branchName: default_branch, localFolder}) // 获取仓库分支内容
            .then((success, err) => {
              if (err) throw err
              else {
                resBody = {...resBody, localFolder, resultOfgetBranchContent: success}
                cb(resBody)
              }
            }).catch(err => {
              console.log(err)
              resBody = {...resBody, localFolder, resultOfgetBranchContent: err}
              cb(resBody)
            })
          }
        })
      }
    })
  },

  [ipc_channel.READ_LOCAL_PATH]: ({params, cb}) => {
    var {path} = params

    readLocalDir_OR_FileWithPath({path})
    .then(data => {
      //console.log('要返回的 pathsArr: ', data)
      cb(data)
    })
  },

  [ipc_channel.READ_LOCAL_FILE]: ({params,cb}) => {
    var {path} = params

    readAFile({path, cb})
  }
  /*
  [ipc_channel.GET_USER_INFO]: ({params, cb}) => {
    var username = params.username
    let client = github.client(github_token)

    client.get(`/users/${username}`, {}, function (err, status, body, headers) {
      console.log({body}); //json object
      if(!err && status === 200) {
        cb(body)
      }
    })
  },
  */
  /*

  [ipc_channel.GET_REPOS]: ({params, cb}) => {
    var username = params.username
    let client = github.client(github_token)

    client.get(`/users/${username}/repos`, {}, (err, status, body, headers) => {
      if(!err && status === 200) {
        console.log({body})
        cb(body)
      }
    })
  },
 */

  


  /*
  [ipc_channel.LOGIN_GITHUB]: ({params,  cb}) => {
    const {username, password}  = params

    var scopes = {
      'scopes': ['user', 'repo', 'gist'],
    };

    github.auth
    .config({username, password})
    .login(scopes, (err, id, token, headers) => {
      console.log(err, id, token, headers)

      cb({id, token})
    })
   */
    /*
    let client = github.client({username, password})

    client.get(`/user`, {}, (err, status, body, headers) => {
      if(!err && status === 200) {
        cb(body)
      }
    })
    
  }
 */
}