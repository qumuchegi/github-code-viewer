import React, {useEffect} from 'react'
import './index.css'
import uuid from 'uuid'

import forkImg from '../../../static/fork.png'
import watchImg from '../../../static/watch.png'

export default function RepoInfo ({repoInfo}) {
  useEffect(() => {
   console.log('12121212', repoInfo)
  }, [repoInfo])

  return (
    <div id='repo-info-body'>
      <h4>仓库拥有者</h4>
      <div id="repo-owner-info">
        <img src={repoInfo.ownerAvatar}></img>
        <div id="repo-owner-name">{repoInfo.repoOwner}</div>
      </div>
      <h4>仓库信息</h4>
      <div id="repo-sample-info">
        <div id='branches'>
          {
            repoInfo.branches.map(el=>
              <span key={uuid()} className="branch-name">
                {el.name}
              </span>
            )
          }
        </div>
        <div id="repo-fork-watch">
          <div>
            <img src={forkImg}/>
            {repoInfo.forks_count}
          </div>
          <div>
            <img src={watchImg}/>
            {repoInfo.watchers_count}
          </div>
        </div>
        <div id='repo-description'>{repoInfo.description}</div>
        <div id="homepage">
          <span className='key'>仓库主页</span>
          <span className='value'>{repoInfo.homepage || '无'}</span>
        </div>
        <div id='time'>
          <div>
            <span className='key'>最近更新</span>
            <span className='value'>{repoInfo.updated_at}</span>
          </div>
          <div>
          <span className='key'>发布于</span>
          <span className='value'>{repoInfo.created_at}</span>
          </div>
        </div>
      </div>
    </div>
  )
}