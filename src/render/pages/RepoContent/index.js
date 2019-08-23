import React,{useEffect, useState} from 'react'
import Split from 'split.js'
import {connect} from 'react-redux'
import {Input, Button, Icon, message} from 'antd'

import api from '../../api'

import Sider from '../../components/sider'
import Content from '../../components/content'

import startAppImg from '../../../static/start-app.PNG'

import './index.css'

function RepoContent ({repoIDWillShowContent, localRepoDirPath, fileShow2Editor_path, /*history*/}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  
  useEffect(() => {
    //console.log('react router history:', history)
    //console.log('为什么编译包功能缺失？？？？')
    if(localStorage.getItem('github-token')) { // 已经登录过
      setIsLogin(true)
    }

    Split(['#left-split', '#right-split'], {
      sizes: [15, 85],
      minSize: [140, 900],
      //expandToMin: true,
      direction: 'horizontal',
      gutterSize: 4,
      
      elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
      }),
      
      gutterStyle: (dimension, gutterSize) => ({
        'flex-basis':  `${gutterSize}px`,
      }),
    })
  }, [])

  function login(){
    if(!username || !password) return message.warn('请填写用户名或者密码')
    setLoginLoading(true)
    api.loginGithub({username, password, cb:(res) => {
      setLoginLoading(false)
      let {id, token} = res
      localStorage.setItem('username', username)
      localStorage.setItem('password', password)
      localStorage.setItem('id', id)
      localStorage.setItem('github-token', token)
      if(localStorage.getItem('github-token')) {
        setIsLogin(true)
      }
    }})
  }

  function logout () {
    let username = localStorage.getItem('username')
    let password = localStorage.getItem('password')
    let id = localStorage.getItem('id')
    api.logoutGithub({username, password, id, cb: (res) => {
      console.log(res)
      if (res.msg === '已经退出登录') {
        localStorage.clear()
        setIsLogin(false)
      }
    }})
  }

  return (
    <div>
      <div id='repo-content' className={repoIDWillShowContent || localRepoDirPath ? 'show':'hide'}>
        <div id="left-split">
          <Sider repoID={repoIDWillShowContent}/>
        </div>
        <div id="right-split">
          <Content fileShow2Editor_path={fileShow2Editor_path}/>
        </div>
      </div>
      <div className={repoIDWillShowContent || localRepoDirPath ? 'hide':'show'} id="start-app-container">
        <div id="login-for-token" className={isLogin ? "hide-login-container":"show-login-container"}>
          <h3>登录GitHub</h3>
          <Input placeholder="GitHub 用户名" id="username" allowClear onInput={e => setUsername(e.target.value)}/>
          <Input placeholder="密码" id='password' allowClear onInput={e => setPassword(e.target.value)}/>
          <Button type='primary' block onClick={login} loading={loginLoading}>登录</Button>
        </div>
        <div className={isLogin ? "show-login-container":"hide-login-container"} id='had-login'>
          <h3>您已经登录 github </h3>
          <Button onClick={logout}>退出登录</Button>
        </div>
        <img src={startAppImg} id="start-app-img"/>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  repoIDWillShowContent: state.headerReducer.repoIDWillShowContent,
  localRepoDirPath: state.headerReducer.localRepoDirPath,
  fileShow2Editor_path: state.prjTreeReducer.fileShow2Editor_Path,

})

export default connect(mapStateToProps)(RepoContent)