import Aws from 'aws-sdk'
import getConfig from '../config'
import { readBinaryFileSync } from '../file/read-local-file'

let config
let lambda

const init = async () => {
  if (lambda) return
  config = await getConfig()
  lambda = new Aws.Lambda({})
}

const created = async () => {
  const list = await lambda.listFunctions({}).promise()

  return list.Functions.some(
    func => func.FunctionName === config.lambdaName,
  )
}

const create = async () => {
  if (await created()) throw new Error('lambda already created')

  console.log('creating lambda...')

  const func = await lambda
    .createFunction({
      FunctionName: config.lambdaName,
      Code: {
        ZipFile: readBinaryFileSync(config.lambdaZipLocation),
      },
      Runtime: 'nodejs6.10',
      Role: config.lambdaServiceRole,
      Handler: 'index.handler',
      Publish: true,
    })
    .promise()

  console.log(func)
}

const update = async () => {
  const isCreated = await created()
  if (!isCreated) throw new Error('lambda not created yet')

  console.log('updating lambda...')

  const func = await lambda
    .updateFunctionCode({
      FunctionName: config.lambdaName,
      ZipFile: readBinaryFileSync(config.lambdaZipLocation),
      Publish: true,
    })
    .promise()

  console.log(func)
}

const createOrUpdate = async () => {
  console.log('## create or update lambda ##')
  await init()

  if (await created()) await update()
  else await create()
}

export default createOrUpdate
