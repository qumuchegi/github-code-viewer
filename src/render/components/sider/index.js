import React, {useEffect, useState} from 'react'
import PrjTree from '../prj-tree'
import {connect} from 'react-redux';

import repoIcon from '../../../static/repo.png'

import './index.css'
import api from '../../api'
let {readDirAndFile} = api

import storeMethods from '../header/store'
let {
  getRepoInfoFromRedux,
  getAllReposInfoFromRedux
} = storeMethods

const mapStateToProps = (state, ownProps) =>{
  return{
    repoIDWillShowContent: state.headerReducer.repoIDWillShowContent
  }
}

export default connect(mapStateToProps)(Sider)

function Sider ({repoIDWillShowContent}) {
  const [dirPaths, setDirPaths] = useState([])
  const [repoInfo, setRepoInfo] = useState(null)

  useEffect(() => {
    console.log(repoIDWillShowContent)
    if(!repoIDWillShowContent) {
      setDirPaths([])
      setRepoInfo(null)
    }
    readLocalDirPath()
  }, [repoIDWillShowContent])

  function readLocalDirPath () {
    if (!repoIDWillShowContent) return
    let repoInfo = getRepoInfoFromRedux(repoIDWillShowContent)
    setRepoInfo(repoInfo)
    let repo_localPath = repoInfo.localFolder
    //console.log(getRepoInfoFromRedux(repoID).localFolder)
    readDirAndFile({
      path: repo_localPath, 
      cb:(res) => {
        setDirPaths(res)
      }
    })
  }

  return (
    <div id="sider">
     <div id="repo-name-container">
      { repoInfo ? 
        <div>
          <img src={repoIcon} id="repo-icon"/>
          <div id="repo-name">
            {repoInfo.repoName}
          </div>
        </div>
        :
        null
      }
     </div>
     <PrjTree dirPaths={dirPaths}/>
    </div>
  )
}
