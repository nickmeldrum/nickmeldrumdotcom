import fs from 'fs'
import path from 'path'
import util from 'util'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const configPath = path.join(__dirname, '..', 'config.json')
const readFile = util.promisify(fs.readFile)

export default async () => {
  const { err, contents } = await readFile(configPath, 'utf8')
  if (err) throw err
  const config = JSON.parse(contents)
  return config
}
