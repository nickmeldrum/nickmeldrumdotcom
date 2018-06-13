import branchname from 'branch-name'

export default async () => {
  console.log('ARGH')
  console.log(process.env)
  console.log('ARGH2')
  return process.env.travis
    ? process.env.travis_branch
    : branchname.get()
}
