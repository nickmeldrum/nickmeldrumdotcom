import fs from 'fs'
import path from 'path'
import util from 'util'
import dirname from './dir-name.mjs'

const readLocalFile = async filename => {
  const filePath = path.join(dirname, '../..', filename)
  const readFile = util.promisify(fs.readFile)
  return readFile(filePath, 'utf8')
}

export const readJsonFile = async filename => JSON.parse(await readLocalFile(filename))

export default readLocalFile
