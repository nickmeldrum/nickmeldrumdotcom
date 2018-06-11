import branchName from './src/branch-name.mjs'
import config from './src/config.mjs'

const executeasync = async () => {
  try {
    /* eslint-disable no-console */
    console.log(await branchName())
    await config()
    /* eslint-enable no-console */
  } catch (e) {
    console.error(e)
  }
}
executeasync()
