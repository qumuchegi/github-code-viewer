import React from 'react'
import { Tree } from 'antd'
const { TreeNode, DirectoryTree } = Tree
//import uuid from 'uuid'
import dispatches from './dispatch'
let {dispatch_fileShowed_path} = dispatches

import './index.css'

export default function PrjTree ({dirPaths}) {

  function onSelect (selectedKeys,e) {
    if(e.node.props.isLeaf) { // 如果是文件
      console.log(selectedKeys, e)
      dispatch_fileShowed_path(selectedKeys[0])
    }
  }

  function onExpand (expandedKeys) { // 展开文件夹
    console.log(expandedKeys)

  }

  function dynamicCreateChildrenTree (dirPaths) { // 使用递归 动态生成子目录树
    let children = dirPaths.sort((a,b) => a-b)
    .map(el => 
        el.type === 1 ?
        <TreeNode 
          isLeaf={true} 
          title={el.name} 
          key={el.path}></TreeNode>
        :
        <TreeNode 
          isLeaf={false}  
          title={el.name} 
          key={el.path} 
         >
           {
            dynamicCreateChildrenTree(el.pathsArr)
           }
        </TreeNode>
      )
   //console.log(children)
    return children
  }

  return(
    <div id="prj-tree">
      <DirectoryTree 
        multiple 
        defaultExpandAll 
        onSelect={onSelect} 
        onExpand={onExpand}
      >
        {dynamicCreateChildrenTree(dirPaths)}
      </DirectoryTree>
    </div>
  )
}