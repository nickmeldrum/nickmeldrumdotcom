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

 * better title for site + fix the 2 nav home links
 * rewrite cv page content for my new profile
 * rewrite mini bio
 * improve logo/ header nav look and feel
 * the scripts in the decorators post!
 * sort out permalinks - add permalink variable to disqus? - what else is permalink important for? canonical/ google webmaster tools?
 * get canonical tag in head (check other existing head tags?)

### Test:

 * disqus commenting
 * ga integration
 * 404's (on missing pages + /blog)
 * canonicals (e.g. trailing slashes, index.html versions)
 * check all old posts - missing imgs, broken tags etc.
 * check responsive width for all old posts is working
 * check (webmaster tools?) that all old urls with juice are still in same place

### After go live:

 * look at progressively upgrading to nicer downloadable font (without compromising initial render times)
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
