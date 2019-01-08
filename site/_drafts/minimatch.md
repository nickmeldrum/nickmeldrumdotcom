> lerna run webdriver:update --scope=@gdw-tests/ui

lerna info version 2.10.1
lerna info scope @gdw-tests/ui
lerna ERR! EPACKAGES Errored while collecting packages and package graph
lerna ERR! TypeError: Cannot read property 'split' of undefined
lerna ERR!     at Minimatch.match (/Users/a640188/src/gdw/node_modules/minimatch/minimatch.js:717:9)
lerna ERR!     at minimatch (/Users/a640188/src/gdw/node_modules/minimatch/minimatch.js:107:42)
lerna ERR!     at /Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:84:36
lerna ERR!     at Array.some (<anonymous>)
lerna ERR!     at filterPackage (/Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:83:18)
lerna ERR!     at /Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:222:18
lerna ERR!     at Array.filter (<anonymous>)
lerna ERR!     at Function.filterPackages (/Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:221:29)
lerna ERR!     at RunCommand.runPreparations (/Users/a640188/src/gdw/node_modules/lerna/lib/Command.js:328:60)
{ TypeError: Cannot read property 'split' of undefined
    at Minimatch.match (/Users/a640188/src/gdw/node_modules/minimatch/minimatch.js:717:9)
    at minimatch (/Users/a640188/src/gdw/node_modules/minimatch/minimatch.js:107:42)
    at /Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:84:36
    at Array.some (<anonymous>)
    at filterPackage (/Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:83:18)
    at /Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:222:18
    at Array.filter (<anonymous>)
    at Function.filterPackages (/Users/a640188/src/gdw/node_modules/lerna/lib/PackageUtilities.js:221:29)
    at RunCommand.runPreparations (/Users/a640188/src/gdw/node_modules/lerna/lib/Command.js:328:60)
    at /Users/a640188/src/gdw/node_modules/lerna/lib/Command.js:204:18 exitCode: 1 }
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! @gdw/parent@1.0.0 webdriver:update: `lerna run webdriver:update --scope=@gdw-tests/ui`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the @gdw/parent@1.0.0 webdriver:update script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/a640188/.npm/_logs/2019-01-07T16_29_36_206Z-debug.log
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! @gdw/parent@1.0.0 postinstall: `npm run bootstrap && npm run link-binaries && npm run webdriver:update`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the @gdw/parent@1.0.0 postinstall script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/a640188/.npm/_logs/2019-01-07T16_29_36_314Z-debug.log
make: *** [install] Error 1
