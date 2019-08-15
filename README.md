# Github-code-viewer

使用 Electron 和 React 制作的一个可以克隆 github 仓库代码，并生成文件树查看的代码阅读器

## 技术栈

1. 框架：

- Electron.
- React.
- Express.
- Webpack.

2. 重要组件：

| 组件 |  用途  |
| --- | --- |
|  [npm 模块 react-codemirror](https://www.npmjs.com/package/react-codemirror)  |  代码编辑器  |
|  [github API 库 octonode](https://github.com/pksunkara/octonode) |  获取用户的 GitHub 账号下的 API，如仓库文件及其内容  |

## 开发

1. 使用 [create-electron-app](https://www.electronforge.io/) 脚手架快速开始 electron 的开发环境: `npx create-electron-app Github-code-viewer --template=webpack`

2. 为了增加 GitHub API 调用上限，需要到github的setting > develop > generate token，创建一个token，然后在发起 API 请求前设置 token：
```js
const {github_token} = require('../../config')
let client = github.client(github_token)
```

## 打包发布

1. 添加个性化的应用图标

## 亮点

1. 使用递归解决了文件树在页面的渲染和读取目录树的文件内容

2. 使用 React 模拟前端，Node.js 模拟后端 API，Electron 链接了两者，借用 Electron 的 ipc 进程通信模拟了前后端 api 通信。

## 疑问

1. 打包应用的时候对图片不能用 file-loader, 只能用 url-loader 生成 data url, 否则应用里图片显示有问题。