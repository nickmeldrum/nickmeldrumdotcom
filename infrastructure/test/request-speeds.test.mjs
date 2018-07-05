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
    .sort((a, b) => a - b)
  const numberOfValuesInTenths = orderedValuesInTenthsOfAms.reduce((curr, next) => {
    // eslint-disable-next-line no-param-reassign
    if (curr[next]) curr[next] += 1
    // eslint-disable-next-line no-param-reassign
    else curr[next] = 1
    return curr
  }, {})
  const mode = Number(
    Object.keys(numberOfValuesInTenths).find(
      i =>
        numberOfValuesInTenths[i] ===
        Math.max(...Object.values(numberOfValuesInTenths)),
    ),
  )
  return {
    inMilliseconds: {
      min: timings.reduce(
        (curr, next) => (curr < next ? curr : next),
        Number.MAX_VALUE,
      ),
      max: timings.reduce((curr, next) => (curr > next ? curr : next), 0),
      mean: timings.reduce((curr, next) => curr + next) / timings.length,
    },
    inTenthsOfAMillisecond: {
      numberOfValues: numberOfValuesInTenths,
      median:
        orderedValuesInTenthsOfAms[
          Math.floor(orderedValuesInTenthsOfAms.length / 2)
        ],
      mode,
    },
  }
}

const makeCalls = async (sequentialCount, concurrentCount) => {
  console.log(
    `${sequentialCount} sequential calls of ${concurrentCount} concurrent calls:`,
  )
  const timings = []
  for (let i = 0; i < sequentialCount; i += 1) {
    const concurrentCalls = []
    for (let j = 0; j < concurrentCount; j += 1) {
      concurrentCalls.push(await getSingleTiming()) // eslint-disable-line no-await-in-loop
    }
    const concurrentTimingsPromise = Promise.all(concurrentCalls)
    const concurrentTimings = await concurrentTimingsPromise // eslint-disable-line no-await-in-loop
    Array.prototype.push.apply(timings, concurrentTimings)
  }
  console.log(parseResults(timings))
}

const executeasync = async () => {
  await makeCalls(100, 1)
  await makeCalls(10, 10)
  await makeCalls(1, 100)
}

executeasync().catch(e => {
  console.error(e)
  process.exit(42)
})
