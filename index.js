/**
 * @file index
 * @author big-wheel
 * @description
 */
const FilemanClient = require('./FilemanClient')

module.exports = function filemanClient(opt) {
  return new FilemanClient(opt)
}
module.exports.FilemanClient = FilemanClient
