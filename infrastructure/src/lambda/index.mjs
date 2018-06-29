import Aws from 'aws-sdk'
import getConfig from 'src/config'
import { readBinaryFileSync } from 'src/file/read-local-file'
import { updateDistributionWithLambda } from 'src/cloudfront'

let config
let lambda

const init = async () => {
  if (lambda) return
  config = await getConfig()
  lambda = new Aws.Lambda({})
}

const created = async lambdaName => {
  const list = await lambda.listFunctions({}).promise()

  return list.Functions.some(func => func.FunctionName === lambdaName)
}

const create = async (name, zipLocation) => {
  if (await created(name)) throw new Error('lambda already created')

  console.log('creating lambda...')

  const func = await lambda
    .createFunction({
      FunctionName: name,
      Code: {
        ZipFile: readBinaryFileSync(zipLocation),
      },
      Runtime: 'nodejs6.10',
      Role: config.lambdaServiceRole,
      Handler: 'index.handler',
      Publish: true,
    })
    .promise()

  console.log(func)
  return func.FunctionArn
}

const update = async (name, zipLocation) => {
  const isCreated = await created(name)
  if (!isCreated) throw new Error('lambda not created yet')

  console.log('updating lambda...')

  const func = await lambda
    .updateFunctionCode({
      FunctionName: name,
      ZipFile: readBinaryFileSync(zipLocation),
      Publish: true,
    })
    .promise()

  console.log(func)
  return func.FunctionArn
}

const createOrUpdate = async (name, zipLocation) => {
  let lambdaArn
  if (await created(name)) lambdaArn = await update(name, zipLocation)
  else lambdaArn = await create(name, zipLocation)
  return lambdaArn
}

const createOrUpdateAll = async () => {
  console.log('## create or update lambdas ##')
  await init()

  console.log(`${config.originRequestLambdaName}...`)
  const originLambdaArn = await createOrUpdate(
    config.originRequestLambdaName,
    config.originRequestLambdaZipLocation,
  )

  console.log(`${config.viewerRequestLambdaName}...`)
  const viewerLambdaArn = await createOrUpdate(
    config.viewerRequestLambdaName,
    config.viewerRequestLambdaZipLocation,
  )

  await updateDistributionWithLambda({
    originLambdaArn,
    viewerLambdaArn,
  })
}

export default createOrUpdateAll
