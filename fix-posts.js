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
---
  layout: post
title: "The argument for SASS"
shortDescription: "Some people don't like it, I would like to try to persuade them..."
date: 2015-12-16 14:02:00
---

        console.log(file)
      }
      /*
      // Make one pass and make the file complete
      var fromPath = path.join( moveFrom, file );
      var toPath = path.join( moveTo, file );

      fs.stat( fromPath, function( error, stat ) {
      if( error ) {
      console.error( "Error stating file.", error );
      return;
      }

      if( stat.isFile() )
      console.log( "'%s' is a file.", fromPath );
      else if( stat.isDirectory() )
      console.log( "'%s' is a directory.", fromPath );

      fs.rename( fromPath, toPath, function( error ) {
      if( error ) {
      console.error( "File moving error.", error );
      }
      else {
      console.log( "Moved file '%s' to '%s'.", fromPath, toPath );
      }
      } );
      } );
      */
    })
  })
})

