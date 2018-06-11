import { readJsonFile } from '../file/read-local-file.mjs'
import branchName from './branch-name.mjs'
import { interpolateAllValues } from './interpolate.mjs'

const configFilename = 'config.json'

export default async () => {
  const configTemplate = await readJsonFile(configFilename)
  return interpolateAllValues(configTemplate, { BRANCH_NAME: await branchName() })
}
