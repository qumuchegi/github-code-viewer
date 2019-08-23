var github = require('octonode')
var ipc_channel = require('../../const/ipc_channel')
const fs = require('fs')

const {getABranchContent, readLocalDir_OR_FileWithPath, readAFile} = require('./middleweres')

module.exports = {
  [ipc_channel.LOGIN_GITHUB]: ({params, cb}) => {
    let {username, password} = params

    var scopes = {
      'scopes': ['user', 'repo', 'gist'],
      'note': 'admin script'
    }
    
    github.auth.config({
      username,
      password
    }).login(scopes, function (err, id, token, headers) {
      console.log(id, token)
      if(!err) cb({id, token})
    })
  },

  [ipc_channel.LOGOUT_GITHUB]: ({params, cb}) => {
    let {username, password, id} = params

    github.auth.config({
      username,
      password
    }).revoke(id, function (err) {
      if (err) throw err
      else cb({msg: '已经退出登录'})
    })
  },

  [ipc_channel.GET_REPO]: ({params, cb}) => {
    let resBody
    const {repoUrl, localFolder, token} = params
    let client = github.client(token)
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

        client.get('repos/' + username_reponame + '/branches', {},  async(err, status, body, headers) => { // 获取所有分支数组
          if (err) {
            console.log(err)
            throw err
          }
          else if(status === 200) {
            resBody = {...resBody, branches: body}

            function writeRepoInfo(){
              return new Promise((res,rej)=>{
                let willWriteData = {}
                for (let item in resBody) {
                  willWriteData[item] = resBody[item]
                }

                let filePath = localFolder + '/extra-repo-info.json'
                fs.writeFile(filePath, JSON.stringify(willWriteData), 'utf8', (err)=> {
                  if(!err) res()
                  //else rej(false) 
                } )
              })
            }
            await  writeRepoInfo()
            
            getABranchContent({username_reponame, branchName: default_branch, localFolder, token}) // 获取仓库分支内容
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
  },

  [ipc_channel.READ_LOCAL_REPO_INFO_FILE]: ({params, cb}) => {
    fs.readFile(params.path, 'utf8', (err, data) => {
      if(data) cb(JSON.parse(data))
      else {// 没有 extra-repo-info.json 文件，说明不是使用此软件克隆的仓库
        cb('没有 extra-repo-info.json 文件')
      }
    })
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