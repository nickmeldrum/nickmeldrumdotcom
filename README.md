## pre-requisites

 * Ruby (to run jekyll and gem install the dependencies)
 * Git client (to push updates to a github repo)

## Installation

Run `. script/init` to setup shell to easily run script commands.

## Commands

Note: to run any commands in a shell, you must run the `. script/init` command first to setup the shell correctly.

To run the jekyll site locally run the `local:run` command.

## TODO

### Before go live:
EXTRA TODO:

 * check that /blog etc. don't show directory listings - maybe add a /blog page?

 * add cv page back in
 * rewrite cv page content for my new profile
 * build a 404 page
 * combine this repo with the travis automation one and get it autopublishing
 * get our gtm/ga integration in
 * add mini bio in index.html
 * get disqus commenting back in
improve logo/ header nav look and feel
get redirects working - so the old /cv permalink redirects to /about
the scripts in the decorators post!
sort out permalinks - add permalink variable to disqus? - what else is permalink important for? canonical/ google webmaster tools?
test disqus commenting

 * get our gtm/ga integration in
 * combine this repo with the travis automation one and get it autopublishing
 * make a 404 return our 404 page
 * check all old posts - missing imgs, broken tags etc.
 * check responsive width for all old posts is working

### Maybe before?

 * fix responsive width for svg in decorator post
 * sort out permalinks - add permalink variable to disqus? - what else is permalink important for? canonical/ google webmaster tools?
 * test disqus commenting
 * the scripts in the decorators post!
 * rewrite cv page content for my new profile
 * add github etc. flair
 * older/newer, next/prev - are they in the right direction? (check medium?)
 * get proper color scheme - base link colors/ other site colors/ favicon and brand logo on them

### After go live:

 * get a better li style
 * get proper quotes in text
 * add "share" links at bottom of post page?
 * get all the weird head attributes we need in nowadays
 * add tests using html proofer
 * get twitter plugin in
 * get search in
 * get my header image in and parallax scrolling (css only)
 * create a dark theme switch
 * look at gradual font improvement on load (currently waits for css/ fonts to download before rendering)

 * look at writing automation scripts for the platform setup:
   * s3 bucket create
   * cloudfront create and set origin to s3
   * set access identity for cf to write to and read from s3
   * lambda edge triggered on cd origin request to rewrite index-html
   * setup execution roles for lambda edge trigger
   * setup travis to auto deploy

### References:

 * https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html#lambda-edge-permissions
 * https://aws.amazon.com/blogs/compute/implementing-default-directory-indexes-in-amazon-s3-backed-amazon-cloudfront-origins-using-lambdaedge/
