const fs = require('fs')
const path = require('path')
const os = require('os')

const rootDir = path.join(__dirname, '../..')
const distributionConfig = 'cf-testing-config.json'
const newConfig = 'cf-testing-config-new.json'
const distributionConfigPath = path.join(rootDir, distributionConfig)
const newConfigPath = path.join(rootDir, newConfig)

const dealWithError = err => {
  if(err) {
    console.error(err)
    process.exit(1)
  }
}

const arn = process.argv[2]

const updateLambdaConfig = conf => {
  conf.Quantity = 1
  conf.Items = []
  conf.Items.push({
    LambdaFunctionARN: arn,
    EventType: 'origin-request',
  })
}

const serialiseConfig = conf => JSON.stringify(conf, null, 2).replace(/\n/, os.EOL)

fs.readFile(distributionConfigPath, 'utf8', function(err, contents) {
  dealWithError(err)
  const config = JSON.parse(contents)
  const distConfigRoot = config.DistributionConfig
  const lambdaConfig = distConfigRoot.DefaultCacheBehavior.LambdaFunctionAssociations

  updateLambdaConfig(lambdaConfig)

  const newConfig = serialiseConfig(distConfigRoot)

  fs.writeFile(newConfigPath, newConfig, 'utf8', err => {
    dealWithError(err)
    console.log('written new dist config...')
  })
})
