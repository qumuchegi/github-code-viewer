import React,{useEffect, useState} from 'react'
import Split from 'split.js'
import {connect} from 'react-redux'

import Sider from '../../components/sider'
import Content from '../../components/content'

import './index.css'

function RepoContent ({repoIDWillShowContent, fileShow2Editor_path}) {
  const [editorWidth, setEditorWidth] = useState()
  useEffect(() => {
     setEditorWidth(document.getElementById('repo-content').offsetWidth - document.getElementById('left-split').offsetWidth)
  }, [repoIDWillShowContent])

  useEffect(() => {
    Split(['#left-split', '#right-split'], {
      sizes: [10, 90],
      minSize: [100, 900],
      expandToMin: true,
      direction: 'horizontal',
      gutterSize: 3,
      /*
      elementStyle: (dimension, size, gutterSize) => ({
        'flex-basis': `calc(${size}% - ${gutterSize}px)`,
      }),
      */
      gutterStyle: (dimension, gutterSize) => ({
        'flex-basis':  `${gutterSize}px`,
      }),
    })
  }, [])

  return (
    <div id='repo-content'>
      <div id="left-split">
        <Sider repoID={repoIDWillShowContent}/>
      </div>
      <div id="right-split">
        <Content fileShow2Editor_path={fileShow2Editor_path} width={editorWidth}/>
      </div>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  repoIDWillShowContent: state.headerReducer.repoIDWillShowContent,
  fileShow2Editor_path: state.prjTreeReducer.fileShow2Editor_Path
})

export default connect(mapStateToProps)(RepoContent)