const fs = require('fs')
const path = require('path')

const metaDataFilename = 'metadata.json'
const postsDir = path.join(__dirname, 'site/_posts')
const metaDataPath = path.join(postsDir, metaDataFilename)
const draftsDir = path.join(__dirname, 'site/_drafts')

const dealWithError = err => {
  if(err) {
    console.error(err)
    process.exit(1)
  }
}

fs.readFile(metaDataPath, 'utf8', function(err, contents) {
  dealWithError(err)
  const metaData = JSON.parse(contents.trim())

  fs.readdir(postsDir, function(err, files) {
    dealWithError(err)

    files.forEach(function(file, index) {
      if (!(file === 'metadata.json' || !isNaN(file[0]))) {
        const fullPostPath = path.join(__dirname, 'site/_posts', file)
        fs.readFile(fullPostPath, 'utf8', (err, contents) => {
          dealWithError(err)

          const fileMetaData = metaData.find(item => item.Slug === file.replace('.md', ''))

          if (fileMetaData !== undefined) {
            let newContent = '---' + '\n' +
              'layout: post' + '\n' +
              `title: "${fileMetaData.Title}"` + '\n' +
              `shortDescription: "${fileMetaData.ShortDescription}"` + '\n'

            if (fileMetaData.Published) newContent += `date: ${fileMetaData.PublishDate.replace('T', ' ').replace('Z', '')}` + '\n'

            newContent +=
              '---' + '\n' +
              contents.trim()

            const publishDate = fileMetaData.Published ? fileMetaData.PublishDate.substring(0, fileMetaData.PublishDate.indexOf('T')) + '-' : ''
            const newFilename = fileMetaData.Published ? `${publishDate}${file}` : file
            const dirToSaveIn = fileMetaData.Published ? '_posts' : '_drafts'

            fs.writeFile(path.join(__dirname, `site/${dirToSaveIn}`, newFilename), newContent, err => {
              dealWithError(err)

              fs.unlink(fullPostPath, err => {
                dealWithError(err)
              })
            })
          }
        })
      }
    })
  })
})

