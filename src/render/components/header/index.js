import React, {useState, useRef, useEffect} from 'react'
import {connect} from 'react-redux'
import { Modal, Form, Input, Menu, Dropdown,message } from 'antd'
const { SubMenu } = Menu;
import uuid from 'uuid'

import api from '../../api'

import './index.css'

import AddImg from '../../../static/cloud download.png'
import githubIcon from '../../../static/github.png'
import moreIcon from '../../../static/more.png'
import historyImg from '../../../static/history.png'
import devloperImg from '../../../static/devloper.png'
import localFileImg from '../../../static/local.png'

import header_dispatches from './dispatch'
let {
  dispatch_storeNewRepo,
  dispatch_storeHistoryRepos,
  dispatch_showRepoContent,
  dispatch_removeARepo,
  dispatch_hideRepo_byId,
  dispatch_addLocalRepo,
  dispatch_hideRepo_byPath
} = header_dispatches

import prjTree_dispatches from '../prj-tree/dispatch'
let {
  dispatch_hide_fileContent
} = prjTree_dispatches

import storeMethods from './store'

let {
  getRepoInfoFromRedux,
  getAllReposInfoFromRedux,
  getRepoIDWillShowContent,
  getFilePathShowing
} = storeMethods


function Header () {
  const [showAddRepoDialog, setShowAddRepoDialog] = useState(false)
  const [showAddLocalRepoDialog, setShowAddLocalRepoDialog] = useState(false)
  const [repoUrl, setRepoUrl] = useState('')
  const [localFolder, setLocalFolder] = useState('')
  const [cloneLoding, setCloneLoding] = useState(false)
  const [historyRepos_IDWidthuuid_and_Avatar, setHistoryRepos_IDWidthuuid_and_Avatar] = useState([])

  const inputShowDirPath = useRef()

  useEffect(() => {
    readHistoryReposTORedux()
  }, [])

  function getRepo () {
    if (!repoUrl || !localFolder) return message.warning('请输入GitHub仓库 URL 和 本地地址', 2, ()=>inputShowDirPath.current.focus())

    let token = localStorage.getItem('github-token')
    if(!token) return message.warning('请先登录 github 以获取 token', 2)

    setCloneLoding(true)
    api.getRepo({
      repoUrl, localFolder, token,
      cb: (res) => {
        console.log('header res:', res)
        let { branches,  has_projects, repoID, repoName,
          description, isForkedFromOther, created_at,
          updated_at, pushed_at, homepage,
          watchers_count, language, forks_count,
          default_branch, repoOwner, ownerID, ownerAvatar,localFolder, resultOfgetBranchContent} = res

        let newRepoInfo = {
          branches,  has_projects, repoID, repoName,
          description, isForkedFromOther, created_at,
          updated_at, pushed_at, homepage,
          watchers_count, language, forks_count,
          default_branch, repoOwner, ownerID, ownerAvatar,localFolder, resultOfgetBranchContent
        }

        // setRepoInfo(newRepoInfo) // useState

        dispatch_storeNewRepo(newRepoInfo) // redux
        localStorage.setItem(repoID, JSON.stringify(newRepoInfo))

        setCloneLoding(false)

        setLocalFolder('')
        setRepoUrl('')

        setTimeout(()=>setShowAddRepoDialog(false), 600)
        readHistoryReposTORedux()
        setTimeout(()=>{
          console.log('从 Redux 取新仓库：', getRepoInfoFromRedux(repoID))
          console.log('从 Redux 取历史仓库：', getAllReposInfoFromRedux())
          //console.log('从 localStorage 取仓库：', JSON.parse(localStorage.getItem(repoID)))
        }, 1000)
      }
    })
  }

  function readHistoryReposTORedux() {
    let length_of_localStorage = localStorage.length
    let historyRepos = [], historyRepos_IDWidthuuid_and_Avatar = []
    for (let i=0; i<length_of_localStorage; i++) {
      let key = localStorage.key(i) // key 即 repoID
      let skip = ['github-token', 'id', 'username', 'password']
      if(skip.includes(key)) continue // 跳过登录过返回存储在 localStorage 里的用户 token 和 id 、username、password
      let repo = JSON.parse(localStorage.getItem(key))

      console.log('localStorage 读到 Redux:', repo)
      historyRepos_IDWidthuuid_and_Avatar.push({id: repo.repoID, avatar: repo.ownerAvatar, repoName: repo.repoName})
      historyRepos.push(repo)
    }

    setHistoryRepos_IDWidthuuid_and_Avatar(historyRepos_IDWidthuuid_and_Avatar)
    dispatch_storeHistoryRepos(historyRepos)
  }

  function cancelGetRepo () {
    setLocalFolder('')
    setRepoUrl('')
    setShowAddRepoDialog(false)
  }

  function readDirPath (e) {
    e.persist() // 处于安全考虑， 浏览器会将 path 读成 C://fakepath/XXX，这里使用  e.persist() 可以避免此种情况，读出真实的 path
    console.log(e.target.files[0].path, inputShowDirPath.current)
    setLocalFolder(e.target.files[0].path) // 仓库文件将要放置的位置
  }

  function showRepoContent (repoID) {
    dispatch_hide_fileContent()
    dispatch_showRepoContent(repoID)
    console.log('Redux 存储要现实内容的repoID:', getRepoIDWillShowContent())
  }

  function removeRepo(id) {
    dispatch_hide_fileContent()
    console.log(id)
    //console.log(getAllReposInfoFromRedux())
    localStorage.removeItem(id)
    dispatch_removeARepo(id)
    dispatch_hideRepo_byId(id)
    let newRepos = historyRepos_IDWidthuuid_and_Avatar.filter(el => el.id !== id)
    setHistoryRepos_IDWidthuuid_and_Avatar(newRepos)

  }

  function addLocalRepo() {
    dispatch_hide_fileContent()
    console.log('编译出错：',localFolder)
    dispatch_addLocalRepo(localFolder)
    setShowAddLocalRepoDialog(false)
    setLocalFolder('')
    dispatch_hideRepo_byId()
  }

  const getRepoDialogTitle = 
    <div id="login-dialog-title">
      <span>获取 GitHub 仓库</span>
      <img src={githubIcon} id="github-icon"></img>
    </div>

  const addLocalRepoDialogTitle =
    <div id="login-dialog-title">
      <span>获取本地仓库</span>
      <img src={githubIcon} id="github-icon"></img>
    </div>

  const RepoButton = el => 
  <div className="repo-menu-item"  onClick={()=>showRepoContent(el.id)}>
    <img 
        src={el.avatar} 
        className="history-repo-avatar" 
    />
    <span className="reponame">{el.repoName}</span>
  </div>

  const historyReposMenu = (repos) => 
    <Menu>
      {
        repos.map(el => 
          <SubMenu title={RepoButton(el)} key={uuid()}>
            <Menu.Item >
              <div className="remove-repo-button" onClick={()=> removeRepo(el.id)}>删除</div>
            </Menu.Item>
          </SubMenu>
        )
      }
    </Menu>

  const formItemLayout = {
    labelCol: {
      xs: { span: 14 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17 },
    },
  }
  return(
    <div id="header">
      <Modal
        title={getRepoDialogTitle}
        visible={showAddRepoDialog}
        onOk={getRepo}
        okText="确定"
        okButtonProps={{loading: cloneLoding}}
        onCancel={cancelGetRepo}
        cancelText="取消"
      >
        <Form {...formItemLayout}>
          <Form.Item label="仓库 URL">
            <Input 
              type="text" 
              placeholder='https://github.com/[username]/[reponame].git'
              onInput={e=>setRepoUrl(e.target.value)}
              className="input"/>
          </Form.Item>
          <Form.Item label="本地文件夹">
            <Input 
              type="file" 
              webkitdirectory="true" // 读取文件夹而不是文件
              directory="true" // 读取文件夹而不是文件
              onInput={(e) => readDirPath(e)} 
              id="read-dir1"/>
            <label 
              htmlFor="read-dir1" 
              id="read-dir-path">
              <Input 
                type="text" 
                ref={inputShowDirPath}
                value={localFolder}
                id="show-dir-path" 
                className="input"></Input>
              <img src={moreIcon} id="more-icon"/>
            </label>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={addLocalRepoDialogTitle}
        visible={showAddLocalRepoDialog}
        onOk={addLocalRepo}
        okText="确定"
        cancelText="取消"
        onCancel={()=>setShowAddLocalRepoDialog(false)}
      >
        <Form.Item label="本地仓库路径">
          <Input 
            type="file" 
            webkitdirectory="true" // 读取文件夹而不是文件
            directory="true" // 读取文件夹而不是文件
            onInput={(e) => readDirPath(e)} 
            id="read-dir2"/>
          <label 
            htmlFor="read-dir2" 
            id="read-dir-path">
            <Input 
              type="text" 
              ref={inputShowDirPath}
              value={localFolder}
              id="show-dir-path" 
              className="input"></Input>
            <img src={moreIcon} id="more-icon"/>
            </label>
        </Form.Item>
      </Modal>
      <img src={AddImg} onClick={()=>setShowAddRepoDialog(true)} id="add-repo-button"/>
      <div id="add-local-repo">
          <img src={localFileImg} onClick={()=>setShowAddLocalRepoDialog(true)}/>
      </div>
      <div id='history-repos-container'>
        <Dropdown 
          overlay={historyReposMenu(historyRepos_IDWidthuuid_and_Avatar)} 
          trigger={["click"]}>
          <a className="ant-dropdown-link" href="#">
          <img 
            src={historyImg} 
            id="read-history-repos-from-redux" 
          />
          </a>
        </Dropdown>
        <div id='arrow'></div>
        <div id="history-repos-avatars">
          {
            historyRepos_IDWidthuuid_and_Avatar.length>0 &&
            historyRepos_IDWidthuuid_and_Avatar.map(el => 
              <img 
                src={el.avatar} 
                onClick={()=>showRepoContent(el.id)}
                className="history-repo-avatar" 
                key={uuid()}/>
            )
          }
        </div>
      </div>
      <div id="devloper">
        <a href="https://qumuchegi.github.io/" target="_blank">
          <span>开发者</span>
        </a>
        <img src={devloperImg} />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  
})
export default connect(mapStateToProps)(Header)