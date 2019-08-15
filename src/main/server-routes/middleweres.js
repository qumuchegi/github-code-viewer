var github = require('octonode')
const {github_token} = require('../../config')
let client = github.client(github_token)
var fs = require('fs')

getABranchContent = ({username_reponame, localFolder, branchName, path=""}) => { // /repos/pksunkara/hub/branches/master
  console.log({username_reponame, branchName, path})
  
  return new Promise((resolve, reject) => {
   client.get('repos/' + username_reponame + '/contents/' + path, {ref: branchName}, (err, status, body) => {
    if (err) reject(err)
    else if (status === 200) {

      Promise.all(
          body.map(pathItem => 
            new Promise((resolve, reject) => 
              writeFileContent(resolve, reject, pathItem)
            )
          )
        )
        .then(() => resolve('递归读取分支内容成功'))
        .catch(err => reject(err))

      function writeFileContent (resolve, reject, pathItem) {
        let {
          git_url, // 文件或者文件夹在 github 中的URL , 可以用这个获取文件内容
          name, // 文件或者文件夹名
          path, // 文件或者文件夹,可以用这个获取文件内容
          url,  // 文件或者文件夹
          type  // 文件或者文件夹 类型 ‘file'/'dir'
        } = pathItem;

        
        createDirOrFile(path, type)

        function createDirOrFile (path, type) {
          var localPath = localFolder + '/' + path
          console.log(localPath)
          if (type === 'dir') {
            fs.mkdir(localPath, err => {
              if (err) {reject(`目录创建失败：${err}`)}
              else {
                getABranchContent({username_reponame, localFolder, branchName, path}) // 递归获取 path 下的目录 并写入文件或者创建目录
                resolve()
              }
            })
          } else if (type === 'file') {
            getFileContentWithPath({username_reponame,  path , branchName})
            .then(fileContent => {
              fs.writeFile(localPath,fileContent, 'utf8', err => {
                if (err) {
                  reject(`文件内容写入出错:${err}`)
                  //console.log(err)
                } else {
                  resolve()
                }
              })
            })
          }
        }
      }
    }
  })
 })
}

getFileContentWithPath = ({username_reponame, path, branchName}) => { // 获取一个 path 下的文件内容（如果path是一个文件）或者目录 （如果path是一个目录）
  return new Promise((resolve, reject) => {
    client.get('repos/' + username_reponame + '/contents/' + path, {ref: branchName}, (err, status, body) => {
      if (err) {
        reject(err)
      } else if (status === 200) {
        let contentTypOfBase64 = body.content // base64 格式的文件内容
        let blob = new Buffer(contentTypOfBase64, 'base64')
        let contentTypeOfString = blob.toString()

        resolve(contentTypeOfString)
      }
    })
  })
}

readLocalDir_OR_FileWithPath = ({path: localpath}) => {
  return new Promise((resolve, reject) => {
   
    readDir(localpath).then(resPathArr => {
      resolve(resPathArr)
    })

    function readDir(localpath) {
      //console.log(localpath)
      return new Promise((resolve_1, reject_1) => {
        try{
          fs.readdir(localpath,{ withFileTypes:true },(err, filesORDirs) => {
            //console.log('读取path: ', filesORDirs) 
            console.log(filesORDirs)
            if ( !filesORDirs ) return reject_1()
            let length = filesORDirs.length
            //console.log('length: ', length)
            let withTypeFromSymbol = []
            filesORDirs.forEach((el) => { // 需要把属性名为 symbol 类型的文件类型改成字符串类型
              let type = el[Object.getOwnPropertySymbols(el)[0]]
    
              if (type === 1) { // 文件
                el = {
                  name: el.name,
                  type,
                  path: localpath + '/' + el.name
                }
                withTypeFromSymbol.push(el)
                --length
                //console.log('变化中的 length: ', length)
                if(length === 0) {
                  resolve_1(withTypeFromSymbol)
                }
              } else { // 文件夹
                readDir(localpath + '/' + el.name)
                .then(pathsarr => {
                  el = {
                    name: el.name,
                    type,
                    path: localpath + '/' + el.name,
                    pathsArr: pathsarr
                  }
                  withTypeFromSymbol.push(el)
                  --length
                  //console.log('变化中的 length: ', length)
                  if(length === 0) {
                    resolve_1(withTypeFromSymbol)
                  }
                })
              }
            })
          })
      } catch (err) {
        console.log(err)
      }
      })
    }
  })
}

readAFile = ({path: filePath, cb}) => {
  fs.readFile(filePath,'utf8', (err, data) => {
    if (!err) {
      cb(data)
    }
  })
}

module.exports = {
  getABranchContent,
  getFileContentWithPath,
  readLocalDir_OR_FileWithPath,
  readAFile
}
