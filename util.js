/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/6/5
 * @description
 */
const request = require('superagent')
const join = require('url-join')
const qs = require('querystring')
const type = require('file-type')
const nps = require('path')
const md5 = require('md5')
const toArray = require('toarray')
const fs = require('fs')
const debug = require('debug')('fileman-client:util')

const config = {
  baseUrl: process.env.FM_BASE_URL,
  token: process.env.FM_TOKEN
}

function filenameFromBuffer(buffer) {
  return md5(buffer).slice(0, 20)
}

function getFilePath(file, { cwd, mapBufferPath }) {
  mapBufferPath =
    mapBufferPath || ((file, type) => filenameFromBuffer(file) + type.ext)

  if (Buffer.isBuffer(file)) {
    return mapBufferPath(file, type(file))
  }

  if (typeof cwd === 'string') {
    return nps.relative(cwd, file)
  }
}

// file: [{
//    value: buffer | string,
//    path: 'aa/a.png'
// } | buffer | string ]
// 推送数据

/**
 * @public
 * @typedef {Object} SpecFile
 * @param value {Buffer|string} - string 类型时表示 filename
 * @param path [string]
 *  文件路径名，不填写时候，如果 value 为 Buffer，则为 `md5(buffer).ext`, 可以通过 mapBufferPath 设置
 *   如果 value 为 string，则为 `basename(value)`
 */

/**
 * @public
 * @typedef {SpecFile | Buffer | string} File
 */

/**
 * @public
 * @param file: {File[]|File}
 * @param options [{}]
 * @param options.baseUrl {string} - 拼接的 url 前缀
 * @param options.query [object] - 拼接在 url 之后的 query
 * @param options.cwd [string] - 解析 file[].path 中的绝对路径，变成相对路径
 * @param options.mapBufferPath [function] -
 * @return {Request}
 */
function push(file, options = {}) {
  const { baseUrl, query = {}, token, cwd, mapBufferPath } = options
  let reqPath = baseUrl
  reqPath += '?' + qs.stringify(query)
  debug("push's options:", options)
  debug("push's reqPath:", reqPath)

  let q = request.post(reqPath)
  token && q.set('authorization', token)
  toArray(file).forEach((eachFile, i) => {
    if (null == eachFile) {
      return
    }

    if (typeof eachFile === 'string' || Buffer.isBuffer(eachFile)) {
      eachFile = {
        value: eachFile
      }
    }
    if (!eachFile.path) {
      eachFile.path = getFilePath(eachFile.value, { cwd, mapBufferPath })
    }

    debug("push's eachFile.value:", eachFile.value)
    debug("push's eachFile.path:", eachFile.path)
    q = q.attach(
      String(i),
      eachFile.value,
      eachFile.path ? { filepath: eachFile.path } : null
    )
  })

  return q.then(res => res.body).catch(err => {
    // debug('error', err)
    if (err.response && err.response.body) {
      throw new Error(err.response.body.message)
    }
    throw err
  })
}

module.exports = {
  config,
  push,
  getFilePath,
  filenameFromBuffer
}
