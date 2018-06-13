import Aws from 'aws-sdk'
import { getResourceId } from '../cloudformation'
import getConfig from '../config'

export default async () => {
  const cloudfront = new Aws.CloudFront()
  const config = await getConfig()
  const DistributionId = await getResourceId(
    config.distributionName,
  )
  console.log('invalidating cloudfront...')
  const timestamp = Number(new Date()).toString()
  const invalidation = await cloudfront
    .createInvalidation({
      DistributionId,
      InvalidationBatch: {
        CallerReference: timestamp,
        Paths: {
          Quantity: '1',
          Items: ['/*'],
        },
      },
    })
    .promise()
  console.log(invalidation)
}
