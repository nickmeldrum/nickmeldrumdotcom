import config from './src/config'

const executeasync = async () => {
  /* eslint-disable no-console */
  try {
    console.log(await config())
  } catch (e) {
    console.error('unhandled error, exiting', e)
  }
  /* eslint-enable no-console */
}
executeasync()
