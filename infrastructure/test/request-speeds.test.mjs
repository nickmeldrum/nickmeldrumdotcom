import request from 'request-promise-native'

const getSingleTiming = async () => {
  const response = await request.get({
    url: 'https://d2fueb1s7nwqd0.cloudfront.net/cv',
    time: true,
    resolveWithFullResponse: true,
  })

  return response.statusCode === 200 &&
    response.complete &&
    response.body.includes('<h1>Nick Meldrum')
    ? response.elapsedTime
    : null
}

const parseResults = timings => {
  const orderedValuesInTenthsOfAms = timings
    .map(timing => Math.floor(timing / 10))
    .sort((a, b) => a > b)
  return {
    orderedValuesInTenthsOfAms,
    min: timings.reduce(
      (curr, next) => (curr < next ? curr : next),
      Number.MAX_VALUE,
    ),
    max: timings.reduce((curr, next) => (curr > next ? curr : next), 0),
    mean: timings.reduce((curr, next) => curr + next) / timings.length,
  }
}

const getTimingsForOneHundredSequentialCalls = async () => {
  console.log('one hundred sequential calls:')
  const timings = []
  for (let i = 0; i < 100; i += 1) {
    timings.push(await getSingleTiming()) // eslint-disable-line no-await-in-loop
  }
  console.log(parseResults(timings))
}

const getTimingsForTenSequentialCallsOfTenConcurrentCalls = async () => {
  console.log('ten sequential calls of ten concurrent calls:')
  const timings = []
  for (let i = 0; i < 10; i += 1) {
    const concurrentTimingsPromise = Promise.all([
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
      await getSingleTiming(), // eslint-disable-line no-await-in-loop
    ])
    const concurrentTimings = await concurrentTimingsPromise // eslint-disable-line no-await-in-loop
    Array.prototype.push.apply(timings, concurrentTimings)
  }
  console.log(parseResults(timings))
}

const executeasync = async () => {
  await getTimingsForOneHundredSequentialCalls()
  await getTimingsForTenSequentialCallsOfTenConcurrentCalls()
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
