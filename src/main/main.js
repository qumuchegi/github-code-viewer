const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path')
const routes = require('./server-routes/routes')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray = null
const createWindow = () => {

  tray = new Tray( path.join(__dirname,'/app.ico' ) )
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: '退出',
      click: () => app.quit()
     },
    { 
      label: '关于', 
      click: () => {}
     }
  ])

  // tray.setImage(path.join(__dirname,'/G.png' ))
  // Make a change to the context menu
  contextMenu.items[1].checked = false

  // Call this again for Linux because we modified the context menu
  tray.setContextMenu(contextMenu)
 
  // Create the browser window.
  mainWindow = new BrowserWindow({
    minWidth: 900,
    minHeight: 600,
    //icon: path.join(__dirname,'/G.png' ) ,
    webPreferences:{
      preload: path.join(__dirname,'/preload.js' ) 
      /*
       preload String (可选)  
       -在页面运行其他脚本之前预先加载指定的脚本 无论页面是否集成 Node, 
       此脚本可以访问所有 Node API ，脚本路径为文件的绝对路径。

       由于在本项目 webpack 将 JS 构建为在 浏览器端运行的代码，所以 JS 文件是运行在浏览器页面，
       故不是 Electron 的渲染进程，所以不能访问 Node，
       也就不能访问 Electron，如果要在页面中 使用 electron 的API，可以把 electron 模块 作为全局
       变量引入到浏览器环境，preload 就可以加载这样的引入 electron 的脚本
      */
   
  },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.





for(let routeName in routes) {
  ipcMain.on(routeName, (e, params) => {
    console.log(params)
    routes[routeName]({params, cb: (respond) => {
      e.sender.send(routeName, respond)}
    })
  })
}