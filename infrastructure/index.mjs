import getConfig, { setup } from './src/config'
/*
import createOrUpdateStack from './src/cloudformation'
import updateContent from './src/s3'
import createOrUpdateLambda from './src/lambda'
*/
import acm from './src/acm'

const executeasync = async () => {
  try {
    await setup()
    const config = await getConfig()
    await acm()
    /*
    await createOrUpdateStack()
    await updateContent()
    await createOrUpdateLambda()
    */
  } catch (e) {
    console.error('unhandled error, exiting', e)
  }
}
executeasync()
