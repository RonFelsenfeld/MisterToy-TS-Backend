import fs from 'fs'

export const utilService = {
  makeId,
  readJsonFile,
}

function makeId(length: number = 6) {
  let txt = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return txt
}

function readJsonFile(path: string) {
  const str = fs.readFileSync(path, 'utf8')
  const json = JSON.parse(str)
  return json
}
