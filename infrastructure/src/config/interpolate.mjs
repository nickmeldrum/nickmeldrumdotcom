const interpolate = (templateString, vars) =>
  templateString.replace(/\${(\w+)}/g, (match, p1) => (vars[p1] ? vars[p1] : ''))

export const interpolateAllValues = (object, vars) => {
  const newObject = {}
  Object.keys(object).forEach(key => {
    newObject[key] = interpolate(object[key], vars)
  })
  return newObject
}

export default interpolate
