import branchname from 'branch-name'

export default async () => (process.env.travis ? process.env.travis_branch : branchname.get())
