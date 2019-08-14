import React from 'react'

import CodeEditor from '../code-editor'

import './index.css'

export default function Content ({fileShow2Editor_path, width}) {
  return (
    <div id="content">
      <CodeEditor fileShow2Editor_path={fileShow2Editor_path} width={width}/>
    </div>
  )
}