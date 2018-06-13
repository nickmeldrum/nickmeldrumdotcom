import createOrUpdateStack from './src/cloudformation'
import updateContent from './src/s3'
import createOrUpdateLambda from './src/lambda'
import { setup } from './src/config'

const executeasync = async () => {
  try {
    await setup()
    await createOrUpdateStack()
    await updateContent()
    await createOrUpdateLambda()
  } catch (e) {
    console.error('unhandled error, exiting', e)
  }
}
executeasync()
