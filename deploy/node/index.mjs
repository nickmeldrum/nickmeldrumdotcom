/*
import createOrUpdateStack from './src/cloudformation'
import syncContent from './src/s3'
import invalidate from './src/cloudfront'
*/
import createOrUpdateLambda from './src/lambda'
import { setup } from './src/config'

const executeasync = async () => {
  try {
    await setup()
    /*
    await createOrUpdateStack()
    await syncContent()
    await invalidate()
    */
    await createOrUpdateLambda()
  } catch (e) {
    console.error('unhandled error, exiting', e)
  }
}
executeasync()
