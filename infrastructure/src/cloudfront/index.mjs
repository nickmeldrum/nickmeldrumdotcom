import Aws from 'aws-sdk'
import { getResourceId } from 'src/cloudformation'
import getConfig from 'src/config'

let config
let cloudfront

const init = async () => {
  if (cloudfront) return
  config = await getConfig()
  cloudfront = new Aws.CloudFront()
}

export const updateDistributionWithLambda = async options => {
  await init()

  console.log('updating distribution with lambda associations...')

  const Id = await getResourceId(config.distributionName)

  const distConfig = await cloudfront
    .getDistributionConfig({
      Id,
    })
    .promise()

  const associations = []
  if (options.originLambdaArn)
    associations.push({
      LambdaFunctionARN: options.originLambdaArn,
      EventType: 'origin-request',
    })
  if (options.viewerLambdaArn)
    associations.push({
      LambdaFunctionARN: options.viewerLambdaArn,
      EventType: 'viewer-request',
    })

  distConfig.DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations = {
    Quantity: associations.length,
    Items: associations,
  }
  console.log(
    distConfig.DistributionConfig.DefaultCacheBehavior.LambdaFunctionAssociations,
  )

  const updateDist = await cloudfront
    .updateDistribution({
      DistributionConfig: distConfig.DistributionConfig,
      Id,
      IfMatch: distConfig.ETag,
    })
    .promise()
  console.log(updateDist)
}

export const invalidate = async () => {
  await init()
  const DistributionId = await getResourceId(config.distributionName)
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
