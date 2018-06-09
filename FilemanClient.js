/**
 * @file FilemanClient
 * @author Cuttle Cong
 * @date 2018/6/5
 * @description
 */
const { config, push, filenameFromBuffer } = require('./util')
const w = require('walli')
const dayjs = require('dayjs')
const join = require('url-join')

function getImgPathPrefix() {
  return dayjs().format('YYYY/MM/DD')
}

class FilemanClient {
  constructor({ baseUrl = config.baseUrl, cwd, token = config.token } = {}) {
    this.options = {
      baseUrl,
      token,
      cwd
    }
    let s = w.leq({
      baseUrl: w.string,
      cwd: w.oneOf([w.string, w.nil]),
      token: w.oneOf([w.string, w.nil])
    }).toUnlawfulString(this.options)
    if (s) {
      throw new Error(s)
    }
  }

  /**
   * 推送图片
   * @public
   * @param file {File}
   */
  pushImg(file, options) {
    return push(
      file,
      Object.assign(
        {
          query: { force: true },
          mapBufferPath: this.constructor.defaultMapImgBufferPath
        },
        this.options,
        options
      )
    )
  }
}

FilemanClient.defaultMapImgBufferPath = (buf, type) =>
  join(getImgPathPrefix(), filenameFromBuffer(buf) + '.' + type.ext)

module.exports = FilemanClient
