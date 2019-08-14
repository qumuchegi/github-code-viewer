import React, { useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/theme/monokai.css';

import './index.css'

import api from '../../api'

let { readLocalFile } = api

export default function CodeEditor ({fileShow2Editor_path, width}) {
    const [codeValue, setCodeValue] = useState()

    useEffect(() => {
      console.log(document.getElementById('left-split').offsetWidth)
      getFileContent(fileShow2Editor_path)
    }, [fileShow2Editor_path])

    function getFileContent (filePath) {
      if(!filePath) return setCodeValue('')
      readLocalFile({
        path: filePath, 
        cb: (res) => {
          setCodeValue(res)
      }})
    }

    const options = {
      theme: 'monokai',
      tabSize: 2,
      keyMap: 'sublime',
      mode: 'javascript',
      readOnly: true,
      lineNumbers: true,
      viewportMargin: 4,
      lint: true
    }

    return (
      <div id="code-editor-body" >
        <CodeMirror 
          options={options}
          value={codeValue} />
      </div>
    )
}
