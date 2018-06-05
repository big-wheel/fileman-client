#!/usr/bin/env node
const fm = require('../')
const program = require('commander')

program
  .option('-c, --cwd <path>', 'Current work directory.', process.cwd())
  .option('-t, --token <token>', 'Token of fileman service.')
  .option('-u, --base-url <url>', 'BaseUrl of fileman service.')
  .option('-p, --path <path>', 'Filename of each upload files.')
  .parse(process.argv)

const opt = {
  baseUrl: program.baseUrl,
  token: program.token,
  cwd: program.cwd || process.cwd(),
  path: program.path
}

fm(opt)
  .pushImg(program.args.map(value => ({ value, path: opt.path })))
  .then(console.log, console.error)
