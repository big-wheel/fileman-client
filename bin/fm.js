#!/usr/bin/env node
/**
 * @file process-scripts
 * @author Cuttle Cong
 * @date 2018/6/3
 * @description
 */

const program = require('commander')
const package = require('../package.json')

program
  .version(package.version)
  .usage('[command] [options]')
  .command('push-img <...files> [options]', 'push images to remote fileman.')
  .parse(process.argv)

process.on('SIGINT', function() {
  program.runningCommand && program.runningCommand.kill('SIGKILL')
  process.exit(0)
})
