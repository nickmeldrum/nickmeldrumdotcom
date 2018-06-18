import getConfig from 'src/config'
import { getResourceId } from 'src/cloudformation'
import { invalidate } from 'src/cloudfront'
import uploadDir from './upload-dir'

export default async () => {
  const config = await getConfig()
  const id = await getResourceId(config.contentBucketName)
  console.log('syncing content with s3...')
  await uploadDir(id, config.contentSourceLocation)
  await invalidate()
}
