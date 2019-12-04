const doSync = params => {
    if (params.error) {
      throw new Error('we borked')
    }
    else {
      return 'we done good'
    }
}

const s3 = {
  sync: (params, callback) => {
    if (callback) {
      try {
        callback(null, doSync(params))
      }
      catch (e) {
        callback(e)
      }
    }
    return {
      promise: () => new Promise((resolve, reject) => {
          try {
            resolve(doSync(params));
          } catch (e) {
            reject(e)
          }
        }),
    }
  },
}

const params = {
  BucketName: 'bucket-name',
  error: false,
};

s3.sync(params).promise()
  .then(data => {
    console.log('done via promise,', data)
  })
  .catch(err => {
    console.error('errored via promises,', err)
  })


s3.sync(params, (err, data) => {
  if (err) {
    console.error('s3 errored,', err)
  }
  console.log('done', data)
})


const wait = new Promise(resolve => setTimeout(resolve(), 1))

const callbacksByDefault = (input, callback) => {
  const something = `hello ${input}`
  wait.then(callback.bind(null, something))
}

callbacksByDefault('callbacks', result => {
  console.log(result)
})

console.log('after callbacks')

const promisifiedCallback = input =>
  new Promise(resolve => callbacksByDefault(input, resolve))

promisifiedCallback('promisified')
  .then(result => console.log(result))

console.log('after promsified')

const promisify = func => (...args) =>
  new Promise(resolve => func(...args, resolve))

const promisifiedByFunc = promisify(callbacksByDefault)

promisifiedByFunc('promisifiedbyfunc')
  .then(result => console.log(result))

console.log('after promisified by func')

const promisesByDefault = input => {
  const something = `hello ${input}`
  return wait.then(() => something)
}

promisesByDefault('promises')
  .then(result => console.log(result))

console.log('after promises')

const callbackifiedPromise = (input, callback) => {
  promisesByDefault(input).then(callback)
}

callbackifiedPromise('callbackified', result => {
  console.log(result)
})

console.log('after callbackified')

const callbackify = func => (...args) => {
  const callback = args.pop()
  func(args).then(callback)
}

const callbackifiedByFunc = callbackify(promisesByDefault)

callbackifiedByFunc('callbackifiedbyfunc', result => {
  console.log(result)
})

console.log('after callbackified by func')
