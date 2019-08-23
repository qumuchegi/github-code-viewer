export default {
  showFileContent: (filePath) => ({
    type: 'SHOW_FILE_CONTENT',
    payload: filePath
  }),
  hideFileCOntent: () => ({
    type: 'HIDE_FILE_CONTENT'
  })
}