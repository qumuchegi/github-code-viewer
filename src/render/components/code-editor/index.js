import React, { useEffect, useState, useRef } from 'react'

import { Remarkable } from 'remarkable';
import hljs from 'highlight.js'
var md = new Remarkable({html: true, 
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }
 
    try {
      return hljs.highlightAuto(str).value;
    } catch (err) {}
 
    return ''; // use external default escaping
  }});

import './index.css'

import api from '../../api'
let { readLocalFile } = api
let path = window.path

export default function CodeEditor ({fileShow2Editor_path}) {
    const [codeValue, setCodeValue] = useState()
    const [fileType, setFileType] = useState()

    const md_container = useRef()

    useEffect(() => {
      //console.log('文件路径:', fileShow2Editor_path)
      getFileType(fileShow2Editor_path)
      getFileContent(fileShow2Editor_path)

    }, [fileShow2Editor_path])

    function getFileType(filePath) {
      if(/\.md$/.test(filePath)) {
        setFileType('md')
      }else{
        //console.log('不是 md')
        setFileType('')
      }
    }
    function getFileContent (filePath) {
      if(!filePath) return setCodeValue('')
      readLocalFile({
        path: filePath, 
        cb: (res) => {
          setCodeValue(res)

      }})
    }

    const renderComp = (type) =>
    {
      if(type!=='md') {
        let codeHtml = '```js' + codeValue + '```'
        codeHtml = md.render(codeHtml)
        return<div 
          dangerouslySetInnerHTML={{ __html: codeHtml}} 
          id="code-viewer" 
          />
      }else{
        let reg_pic = /\<img[^>]*src\=\"([^\"]*)\"[^>]*\>?/gm
        //let reg_src = /src\=\"([^\"]*)\"?/

        let md2html = md.render(codeValue)
        console.log('md2html:', md2html,fileShow2Editor_path)
        md2html = md2html.replace(reg_pic, (match, p1)=>{
          p1 ='.'+p1
          /*
          let reader = new FileReader()
          let inputFile = document.createElement('input')
          inputFile.setAttribute('type', 'file')
          console.log(inputFile)
          */
          return `<img src="${path.join(fileShow2Editor_path, p1)}" alt="">`
        })

        return <div 
                dangerouslySetInnerHTML={{ __html: md2html}} 
                id="md-viewer" 
                ref={md_container}/>
      }
    }

    return (
      <div id="code-editor-body" >
        {
          renderComp(fileType)
        }
      </div>
    )
}
