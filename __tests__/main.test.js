/**
 * @file main
 * @author big-wheel
 * @date 2018/4/4
 */
let port = 10000
process.env.FM_BASE_URL = 'http://localhost:' + port

const fmClient = require('../')
const nps = require('path')
const { existsSync, readFileSync } = require('fs')
const rimraf = require('rimraf')
const dayjs = require('dayjs')
const fileman = require('express-restful-fileman')

function www(name = '') {
  return nps.join(__dirname, 'www', name)
}
const app = require('express')().use(fileman(www(), { token: '1234' }))

function fixture(name = '') {
  return nps.join(__dirname, 'fixture', name)
}

describe('main', function() {
  let server

  beforeAll(function(done) {
    server = app.listen(10000, done)
  })

  afterAll(function() {
    server && server.close()
  })

  afterEach(function() {
    rimraf.sync(www('!(.keep)'))
  })

  it('should upload image passing filename only', function(done) {
    fmClient({ token: '1234' })
      .pushImg([{ value: fixture('Edam.png') }])
      .then(res => {
        expect(existsSync(www('Edam.png'))).toBeTruthy()
      })
      .then(done)
  })

  it('should upload image passing filename and path', function(done) {
    fmClient({ token: '1234' })
      .pushImg([{ value: fixture('Edam.png'), path: 'sss' }])
      .then(res => {
        expect(existsSync(www('Edam.png'))).toBeFalsy()
        expect(existsSync(www('sss'))).toBeTruthy()
      })
      .then(done)
  })

  it('should upload image passing multi-filename and multi-path', function(done) {
    fmClient({ token: '1234' })
      .pushImg(
        [{ value: fixture('Edam.png'), path: 'sss.gif' }, fixture('Edam.png')],
        { cwd: __dirname }
      )
      .then(res => {
        expect(existsSync(www('Edam.png'))).toBeFalsy()
        expect(existsSync(www('sss.gif'))).toBeTruthy()
        expect(existsSync(www('fixture/Edam.png'))).toBeTruthy()
      })
      .then(done)
  })

  it('should upload image passing buffer', function(done) {
    fmClient({ token: '1234' })
      .pushImg(
        [
          { value: readFileSync(fixture('Edam.png')), path: 'sss.gif' },
          readFileSync(fixture('Edam.png'))
        ],
        { cwd: __dirname }
      )
      .then(res => {
        expect(res.code).toBe(200)
        expect(existsSync(www('Edam.png'))).toBeFalsy()
        expect(existsSync(www('sss.gif'))).toBeTruthy()
        expect(existsSync(www('fixture/Edam.png'))).toBeFalsy()

        let p = fmClient.FilemanClient.defaultMapImgBufferPath(
          readFileSync(fixture('Edam.png')),
          { ext: 'png' }
        )
        console.error(p)
        expect(existsSync(www(p))).toBeTruthy()
      })
      .then(done)
  })
})
