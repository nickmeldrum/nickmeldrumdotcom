import fs from 'fs'
import path from 'path'
import util from 'util'
import dirname from './dir-name'

const readLocalFile = async filename => {
  const filePath = path.join(dirname, '../..', filename)
  const readFile = util.promisify(fs.readFile)
  return readFile(filePath, 'utf8')
}

export const getStream = filename => {
  const filePath = path.join(dirname, '../..', filename)
  const stream = fs.createReadStream(filePath)
  stream.on('error', err => {
    throw err
  })
  return stream
}

export const readJsonFile = async filename =>
  JSON.parse(await readLocalFile(filename))

export default readLocalFile
