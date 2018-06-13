# mkdirtemp [![Build status for mkdirtemp on Circle CI.](https://img.shields.io/circleci/project/sholladay/mkdirtemp/master.svg "Circle Build Status")](https://circleci.com/gh/sholladay/mkdirtemp "Mkdirtemp Builds")

> Create a unique temporary directory.

## Why?

 - Fixes the [awkward](https://github.com/nodejs/node/issues/6142) `fs.mkdtemp()` API.
 - Supports `async` and `await`.
 - Sensible defaults.

## Install

```sh
npm install mkdirtemp --save
```

## Usage

Get it into your program.

```js
const mkdirtemp = require('mkdirtemp');
```

Make a new and unique [temporary directory](http://man7.org/linux/man-pages/man3/mkdtemp.3.html).

```js
mkdirtemp().then((dirPath) => {
   console.log(dirPath);
   // => /var/folders/gr/qfsxs2gj0fq1ypdsfd8rj8tr0000gn/T/MKufpq
});
```

## API

### mkdirtemp(cwd)

Returns a `Promise` for the path of the new directory.

#### cwd

Type: `string`<br>
Default: `os.tmpdir()`

Parent of the new directory once it is created.

## Contributing

See our [contributing guidelines](https://github.com/sholladay/mkdirtemp/blob/master/CONTRIBUTING.md "The guidelines for participating in this project.") for more details.

1. [Fork it](https://github.com/sholladay/mkdirtemp/fork).
2. Make a feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. [Submit a pull request](https://github.com/sholladay/mkdirtemp/compare "Submit code to this project for review.").

## License

[MPL-2.0](https://github.com/sholladay/mkdirtemp/blob/master/LICENSE "The license for mkdirtemp.") © [Seth Holladay](http://seth-holladay.com "Author of mkdirtemp.")

Go make something, dang it.
