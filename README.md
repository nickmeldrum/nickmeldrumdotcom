## pre-requisites

 * Ruby (to run jekyll and gem install the dependencies)
 * Git client (to push updates to a github repo)
 * Python 2.6.5 and pip (to install the aws cli)
 * node & yarn to run/test the lambda edge functions locally

## Installation

Run `. script/init` to setup shell to easily run script commands.

MacOS: to get ruby working and gems setup:
```
brew update
brew install rbenv ruby-build
rbenv install 2.3.3
gem install bundler
bundle install
```

to get aws cli setup:
```
brew install python
curl -O https://bootstrap.pypa.io/get-pip.py
python3 get-pip.py --user
pip3 install awscli --upgrade --user
```
add line
`export PATH="/Users/tpunmeld/Library/Python/3.6/bin:$PATH"`
to your .zshrc :)

## Branch/test/deployment strategy

 * Don't touch master branch. Do everything on testing branch.
 * Build it locally, test it locally on the testing branch.
 * then test the testing branch by pushing (which triggers a travis deployment onto the test aws infrastructure.)
 * once happy push to production by merging to master (which triggers the product infrastructure deployment via travis.)

## Commands

Note: to run any commands in a shell, you must run the `. script/init` command first to setup the shell correctly.

 * To run jekyll locally run the `serve-pages` command.
 * To run jekyll locally with drafts run the `serve-drafts` command.
 * To test the request functions run: `test-functions` command.
 * to deploy everything run: `deploy` command. This assumes the static pages and the functions are already built (using `build-pages` and `build-functions`) and then deploys the cf stack, does the s3 sync, the cf invalidation, the lambda publish and cf behaviour triggering.

## CI build/deploy structure in detail

### prep stage:

for jekyll:
 * install ruby, bundler, bundle install (for the gems)
for aws:
 * install python, pip, awscli

### build stage:

 * build static site (jekyll build)
 * build lambda functions (yarn install + zip modules)

### deploy stage:

 * update aws stack (s3 + cloudfront) via cloudformation stack
 * sync static site to s3 bucket and invalidate cf distribution
 * create new version of lambda function and update cf to trigger new version

## Redirects and canonical urls

Jekyll outputs files with .html on the end, and we don't like that - so we have a lambda converting the following urls:

/blog => /blog.html
/cv => /cv.html
/ => /index.html
/page/2 => /page/2/index.html
/blog/beerware => /blog/beerware.html

the 404 page is found at `/404.html` in S3

## TODO:

### Next steps:

 * modify update-stack to be named/described like the test stack
 * get the travis stuff parameterised to testing and prod versions
 * get testing into ci (jekyll + functions)

### Test:

 * disqus commenting
 * canonical is right in live - especially trailing slashes on /blog and /page/2 etc.
 * ga integration
 * 404's (on missing pages + /blog)
 * canonicals (e.g. trailing slashes, index.html versions)
 * check all old posts - missing imgs, broken tags etc.
 * check responsive width for all old posts is working
 * check (webmaster tools?) that all old urls with juice are still in same place

### Site content:

 * rewrite cv page content for my new profile
 * look at progressively upgrading to nicer downloadable font (without compromising initial render times)
 * add a booklist?
 * add a project list?
 * get twitter plugin in
 * get proper color scheme - base link colors/ other site colors/ favicon and brand logo on them
 * older/newer, next/prev - are they in the right direction? (check medium?)
 * add github etc. flair
 * fix responsive width for svg in decorator post
 * get a better li style
 * get proper quotes in text
 * add "share" links at bottom of post page?
 * get all the weird head attributes we need in nowadays
 * add tests using html proofer
 * get search in?
 * get my header image in and parallax scrolling (css only)
 * create a dark theme switch
 * look at gradual font improvement on load (currently waits for css/ fonts to download before rendering)

### Infrastructure:

 * check can you aws sync content + invalidate inside cloudformation stack?
 * get lambda published via sam template + integrated into cloudformation stack update?
 * create a domain redirect if the domain ain't nickmeldrum.com (https)

## Links

 * https://github.com/nickmeldrum/nickmeldrumdotcom
 * https://travis-ci.org/nickmeldrum/nickmeldrumdotcom

### References:

 * https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html#lambda-edge-permissions
 * https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
 * https://read.acloud.guru/supercharging-a-static-site-with-lambda-edge-da5a1314238b
 * https://forums.aws.amazon.com/thread.jspa?messageID=799381&tstart=0 ( make host available in origin request )
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html ( read clodufromation docs )
