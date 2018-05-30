const fs = require('fs')
const path = require('path')

const rootDir = path.join(__dirname, '../..')
const distributionConfig = 'cf-testing-config.json'
const distributionConfigPath = path.join(rootDir, distributionConfig)

const dealWithError = err => {
  if(err) {
    console.error(err)
    process.exit(1)
  }
}

fs.readFile(distributionConfigPath, 'utf8', function(err, contents) {
  dealWithError(err)
  const config = JSON.parse(contents)
  console.log(config.ETag)
})
