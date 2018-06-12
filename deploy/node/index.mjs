import createOrUpdateStack from './src/cloudformation'
import { setup } from './src/config'

const executeasync = async () => {
  try {
    await setup()
    await createOrUpdateStack()
  } catch (e) {
    console.error('unhandled error, exiting', e)
  }
}
executeasync()
