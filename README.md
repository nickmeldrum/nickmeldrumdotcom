## pre-requisites

 * Ruby (to run jekyll and gem install the dependencies)
 * Git client (to push updates to a github repo)
 * Python 2.6.5 and pip (to install the aws cli)

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

## Commands

Note: to run any commands in a shell, you must run the `. script/init` command first to setup the shell correctly.

To run jekyll locally run the `local:serve` command.
To run jekyll locally with drafts run the `local:serve-drafts` command.

 * To test the origin request function run: `cd functions/origin-request && yarn && yarn test` 
 * To test the viewer request function run: `cd functions/viewer-request && yarn && yarn test` 

## The stuff

 * https://github.com/nickmeldrum/nickmeldrumdotcom
 * https://travis-ci.org/nickmeldrum/nickmeldrumdotcom
 * https://s3.console.aws.amazon.com/s3/buckets/nickmeldrum-com-blog/?region=us-east-1&tab=overview
 * https://console.aws.amazon.com/cloudfront/home?region=us-east-1#distribution-settings:EXF2TU584W09Y
 * https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/indexhtml-rewrite/versions/10?tab=graph

## Redirects and canonical urls

Jekyll outputs files with .html on the end, and we don't like that - so we have a lambda converting the following urls:

/blog => /blog.html
/cv => /cv.html
/ => /index.html
/page/2 => /page/2/index.html
/blog/beerware => /blog/beerware.html

the 404 page is found at `/404.html` in S3

### Test:

 * disqus commenting
 * canonical is right in live - especially trailing slashes on /blog and /page/2 etc.
 * ga integration
 * 404's (on missing pages + /blog)
 * canonicals (e.g. trailing slashes, index.html versions)
 * check all old posts - missing imgs, broken tags etc.
 * check responsive width for all old posts is working
 * check (webmaster tools?) that all old urls with juice are still in same place

### TODO:

 * build cloudformation template for updating lambda + cloudfront on deploy
 * look at updating lambda code without bumping version?
 * rewrite cv page content for my new profile
 * create a domain redirect if the domain ain't nickmeldrum.com (https)
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

 * look at writing automation scripts for the platform setup:
   * s3 bucket create
   * cloudfront create and set origin to s3, behaviours for 404, 403
   * set access identity for cf to write to and read from s3
   * lambda edge triggered on cd origin request to rewrite index-html
   * setup execution roles for lambda edge trigger
   * setup travis to auto deploy

### References:

 * https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html#lambda-edge-permissions
 * https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
 * https://read.acloud.guru/supercharging-a-static-site-with-lambda-edge-da5a1314238b
 * https://forums.aws.amazon.com/thread.jspa?messageID=799381&tstart=0 ( make host available in origin request )
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html ( read clodufromation docs )
