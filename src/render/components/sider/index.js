import React, {useEffect, useState} from 'react'
import PrjTree from '../prj-tree'

import repoIcon from '../../../static/repo.png'

import './index.css'
import api from '../../api'
let {readDirAndFile} = api

import storeMethods from '../header/store'
let {
  getRepoInfoFromRedux,
} = storeMethods


export default function Sider ({repoID}) {
  const [dirPaths, setDirPaths] = useState([])
  const [repoInfo, setRepoInfo] = useState(null)


  useEffect(() => {
    readLocalDirPath()
  }, [ repoID ])

  function readLocalDirPath () {
    if (!repoID) return
    let repoInfo = getRepoInfoFromRedux(repoID)
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
     <div id="repo-name">
      { repoInfo ? 
        <span>
          <img src={repoIcon} id="repo-icon"/>
          {repoInfo.repoName}
        </span>
        :
        null
      }
     </div>
     <PrjTree dirPaths={dirPaths}/>
    </div>
  )
}