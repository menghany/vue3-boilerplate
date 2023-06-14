'use strict'

const loadEnv = require('../utils/loadEnv')
loadEnv()
loadEnv('production')

const { rimrafSync } = require('rimraf')
const webpack = require('webpack')

const { error, done } = require('../utils/logger')
const { logWithSpinner, stopSpinner } = require('../utils/spinner')
const paths = require('../utils/paths')

const webpackConfig = require('../config/prod')
const config = require('../project.config')

logWithSpinner('Building for production...')

const isSuccess = rimrafSync(paths.resolve(config.outputDir))
if (!isSuccess) {
  throw new Error('delete fail')
}
webpack(webpackConfig, (err, stats) => {
  stopSpinner(false)

  if (err) throw err

  process.stdout.write(
    stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    }) + '\n\n'
  )

  if (stats.hasErrors()) {
    error('Build failed with errors.\n')
    process.exit(1)
  }

  done('Build complete.\n')
})
