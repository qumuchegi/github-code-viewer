import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux';

import PrjTree from '../prj-tree'
import RepoInfo from '../Repo-info'

import repoIcon from '../../../static/repo.png'
import removeRepoImg from '../../../static/remove.png'
import directoryImg from '../../../static/directory.png'
import infoImg from '../../../static/info.png'

import './index.css'
import api from '../../api'
let {readDirAndFile, readRepoInfoFile} = api

import dispatches from '../header/dispatch'
let {dispatch_hideRepo_byId, dispatch_hideRepo_byPath} = dispatches

import storeMethods from '../header/store'
let {
  getRepoInfoFromRedux,
  getAllReposInfoFromRedux
} = storeMethods

const mapStateToProps = (state, ownProps) =>{
  return{
    repoIDWillShowContent: state.headerReducer.repoIDWillShowContent,
    localRepoDirPath: state.headerReducer.localRepoDirPath
  }
}

export default connect(mapStateToProps)(Sider)

import showTypes from '../../../const/showPrjType'

function Sider ({repoIDWillShowContent, localRepoDirPath}) {
  const [reponame, setReponame] = useState()
  const [repoLocalPath, setRepoLocalPath] = useState('')
  const [dirPaths, setDirPaths] = useState([])
  const [repoInfo, setRepoInfo] = useState()
  const [showType, setShowType] = useState(showTypes.prj_dir)

  useEffect(() => {
    
    repoIDWillShowContent && readLocalDirPathById()
   
   }, [repoIDWillShowContent]
  )

  useEffect(() => {
    localRepoDirPath && readLocalDirPathByPath()
   }, [localRepoDirPath]
  )

  function readLocalDirPathByPath () {
    //console.log('00', repoIDWillShowContent)
    setDirPaths([])
    setRepoInfo(null)
    setShowType(showTypes.prj_dir)
    console.log('999999')
   
    setReponame(localRepoDirPath)
    setRepoLocalPath(localRepoDirPath)
    getRepoInfo(localRepoDirPath)
    readDirAndFile({
      path: localRepoDirPath, 
      cb:(res) => {
        setDirPaths(res)
      }
    })

  }

  function readLocalDirPathById () {
    setShowType(showTypes.prj_dir)
    let repoInfo = getRepoInfoFromRedux(repoIDWillShowContent)
    setRepoInfo(repoInfo)
    setReponame(repoInfo.repoName)
    let repo_localPath = repoInfo.localFolder
    setRepoLocalPath(repo_localPath)
    getRepoInfo(repo_localPath)
    //console.log(getRepoInfoFromRedux(repoID).localFolder)
    readDirAndFile({
      path: repo_localPath, 
      cb:(res) => {
        setDirPaths(res)
      }
    })
  }

  function showRepoInfo () {
    setShowType(showTypes.repo_info)
  }

  function getRepoInfo (repoLocalPath) {
    readRepoInfoFile({path: repoLocalPath+'/extra-repo-info.json', cb: (res) => {
      console.log('仓库信息：', res)
      if(typeof res === 'object') setRepoInfo(res) 
      else setRepoInfo('no')
    }})
  }
  function showRepoDir () {
    setShowType(showTypes.prj_dir)
  }

  function removeRepo() {
    dispatch_hideRepo_byId()
    dispatch_hideRepo_byPath()
  }
  return (
    <div id="sider">
     <div id="repo-name-container">
      { repoInfo ? 
        <div>
          <img src={repoIcon} id="repo-icon"/>
          <div id="repo-name">
            {reponame}
          </div>
          {
            repoInfo !== 'no' ?
            <div id="repo-info-button" className="tab">
              <img src={infoImg} onClick={()=>showRepoInfo()} id={showType===showTypes.repo_info ? 'selected':null}/>
            </div> 
            :
            null
          }
          <div id="dir-tree" className="tab">
            <img src={directoryImg} onClick={()=>showRepoDir()} id={showType===showTypes.prj_dir ? 'selected':null}/>
          </div>
          <div id="remove-repo-img" className="tab">
            <img src={removeRepoImg} onClick={()=>removeRepo()}/>
          </div>
        </div>
        :
        null
      }
     </div>
     {
       showType===showTypes.repo_info ? <RepoInfo repoInfo={repoInfo}/>:<PrjTree dirPaths={dirPaths}/>
     }
    </div>
  )
}
