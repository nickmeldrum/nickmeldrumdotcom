import getConfig from '../config'
import { getResourceId } from '../cloudformation'
import uploadDir from './upload-dir'
import { invalidate } from '../cloudfront'

export default async () => {
  const config = await getConfig()
  const id = await getResourceId(config.contentBucketName)
  console.log('syncing content with s3...')
  await uploadDir(id, config.contentSourceLocation)
  await invalidate()
}
