---
layout: default
title: Performant redirects and rewrites on Lambda@Edge
shortDescription: "Some Lessons learned moving a website onto the AWS serverless cloud"
comments: true
---

## The preamble:

### Moving from Azure and .Net

Big caveat at the start: This is nothing against yer Microsoft! :)

I actually still love Azure and .Net/C#, this exercise was purely an excuse to learn about automating an AWS configuration.

The problem that Lambda@Edge is solving for me? Simply put: In my Azure setup I was essentially running an IIS instance via [Azure Web Apps](https://azure.microsoft.com/en-gb/services/app-service/web/) so I ran the IIS rewrite module to manage any redirects and rewrites. In my new setup I am not running a web server, so needed an equivalent of a rewrite module.

#### Enter Lambda@Edge!

AWS now provides us a serverless way of defining some functionality at the request/response point in cloudfront.

### My new AWS based blog platform setup:

<img src="/assets/images/jekyll.svg" alt="Jekyll logo" title="Jekyll logo" class="logo-inset thin">
 * [Jekyll](https://jekyllrb.com/) (Ruby based static website generator) using a completely handcrafted theme to generate the site html and assets
<img src="/assets/images/github-icon-1.svg" alt="Github logo" title="Github logo" class="logo-inset">
 * [Github](https://github.com/nickmeldrum/nickmeldrumdotcom) (Cloud based hosting service for git repositories) to store the code
<img src="/assets/images/travis-ci.svg" alt="Travis CI logo" title="Travis CI logo" class="logo-inset">
 * [Travis CI](https://travis-ci.org/) (Cloud based continuous integration) to trigger a build/test/deploy pipeline based on pushes to the master branch on Github via a webhook
<img src="/assets/images/aws-s3.svg" alt="AWS S3 logo" title="AWS S3 logo" class="logo-inset">
 * [Amazon S3](https://aws.amazon.com/s3) (Cloud based object storage) to store the static html and assets
<img src="/assets/images/aws-cloudfront.svg" alt="AWS CloudFront logo" title="AWS CloudFront logo" class="logo-inset">
 * [Amazon Cloudfront](https://aws.amazon.com/cloudfront) (Global content delivery network service) to expose the website endpoints on the internet (fronting the S3 bucket)
<img src="/assets/images/aws-lambda.svg" alt="AWS Lambda logo" title="AWS Lambda logo" class="logo-inset">
 * [Amazon Lambda@Edge](https://aws.amazon.com/lambda/edge) (Serverless edge networking service) to customize the cloudfront endpoints to setup our redirects and rewrites
<img src="/assets/images/aws-cloudformation.svg" alt="AWS CloudFormation logo" title="AWS CloudFormation logo" class="logo-inset">
 * [Amazon Cloudformation](https://aws.amazon.com/cloudformation) (Serverless edge networking service) to automate the deployment of the AWS infrastructure
<img src="/assets/images/dnsimple-logo.svg" alt="dnsimple logo" title="dnsimple logo" class="logo-inset thin">
 * [DNSimple](https://dnsimple.com/) (Cloud based domain management service) to host and manage the DNS entries
<img src="/assets/images/letsencrypt-logo.svg" alt="Let's Encrypt logo" title="Let's Encrypt logo" class="logo-inset thin">
 * [Let's Encrypt](https://letsencrypt.org/) (Free, automated certificate authority) to provide the digital certificate (managed through DNSimple)

There is obviously a huge amount to this setup which if I have the time I will write about later. In this post I want to focus on what I did with Lambda@Edge to enable redirecting and rewriting in the most performant way possible.

## Why do I need to manage redirects and rewrites?

### The difference between a redirect and rewrite

#### *Redirect* = Telling the customer they got the url wrong by issuing a 301 redirect with the correct location back to the customer

For instance, if a customer finds a link to {% ihighlight text %}https://nickmeldrum//cv//index.html{% endihighlight %} this will actually correctly find my cv page. But it's not on the canonical url, which is: {% ihighlight text %}https://nickmeldrum/cv{% endihighlight %}. Therefore I want to redirect the customer to the canonical, mostly so they don't have a horrible url in the address bar. [*](#appendix-1)

#### *Rewrite* = Changing the url on the way to the origin server. Useful for mapping a public version of a url to an internal representation.

Because of the way Jekyll has generated my static site, all the pages are in the format: {% ihighlight text %}/cv.html{% endihighlight %} in the s3 bucket. therefore I need to rewrite anything that does not have a file extension (e.g. {% ihighlight text %}/cv{% endihighlight %}) to assume it's a page lookup and add the {% ihighlight text %}.html{% endihighlight %} back on so the request will find it's correct origin resource.

## Origin request and Viewer request Lambda@Edge function associations

What's the difference? A viewer request function will be executed on every http request to the CloudFront distribution. An origin request function will be executed on every origin lookup from the CloudFront distribution to the origin (in this case s3.)

The important difference therefore being that the origin request function result can be cached by CloudFront for subsequent requests to the same resource.

Another subtle difference is that you cannot read the host headers of the original http request in an origin request currently; [Only in the viewer request function.](https://forums.aws.amazon.com/thread.jspa?messageID=799381&tstart=0)

## Redirects and rewrites that don't need the hostname

For these redirect/rewrite rules we don't need to know the hostname:

 * remove trailing slashes (a redirect)
 * lowercase all urls (a redirect)
 * trim .html extensions (a redirect)
 * remove default document (a redirect)
 * add .html extension (a rewrite)

Therefore the obvious choice here is an origin request function because the function and the extra execution latency is only an overhead for the 1st call for each origin resource. We practically get these rules for free with no overhead at all due to the caching in CloudFront.

## The origin request implementation

All my code is out in the open so you can [see the full implementation](https://github.com/nickmeldrum/nickmeldrumdotcom/blob/master/functions/origin-request/index.js) and you can [see the tests as well of course](https://github.com/nickmeldrum/nickmeldrumdotcom/blob/master/functions/origin-request/index.test.js).

However, let me explain the basic logic here. Your node origin request function must run on node 6.10 at the latest and takes the form:

exports.handler = (event, context, callback) => {
  // get the request object:
  const request = event.Records[0].cf

  // the request object has:
  //  * `url` property that will be relative here
  //  * `status` and `statusDescription`, both modifiable
  //  * `headers` map with some modifiable headers

  // go do something to the request object

  // my pseudo code is something like:
  newUrl = changeTheUrl(request.url)

  if (newUrl !== request.url) {
    // then the canonical url is different so we need to issue a redirect
  }
  else {
    // then the url is the same, do the rewrite logic
    callback(null, request)
  }
}

Obviously it's a callback so you can work in an async fashion. Just beware of severe limitations with what you can do here, the primary limitation being that your function can run for a maximum of 50ms, so calling out to external resources should be done with extreme care.

I take the view that these need to be super fast and should therefore probably not really rely on anything external.

 // TODO!

## For the rule that needs the hostname:

We had 1, which is to redirect anyone requesting a page on the non-canonical domain to redirect to the canonical one: {% ihighlight text %}https://nickmeldrum.com{% endihighlight %}.
We have various domains (vanity and infrastructure) that *can* point to the CloudFront distribution, but only 1 we consider 'correct':

 * fdhsaiufdioasf.cloudfront.net <- the cloudfront domain that all others have a CNAME (or ALIAS) record to
 * nickmeldrum.co.uk <- a vanity domain name
 * nickmeldrum.net <- a vanity domain name
 * nickmeldrum.com <- bingo - the canonical domain name!

Unfortunately because we cannot read the hostname in an origin request lambda function, we need a viewer request function to manage this type of redirect.

## The big problem: latency

In my tests I measured the latency of any Lambda@Edge function call to be at least 50ms. [https://forums.aws.amazon.com/thread.jspa?threadID=260315](Others have been measuring averages of over 100ms)! This is way too much latency for an edge function. I can accept it for an origin request because it's only the 1st invocation after an invalidation that will take this hit. For viewer requests there is no way I'm going to accept that kind of overhead.

So currently I don't have a good way to manage my domain name redirect rules within the AWS infrastructure. Luckily for now, the old domains are still pointing to the active Azure instance that is just issuing a redirect to nickmeldrum.com. But I would like to properly decommission the Azure instance at some point!

## Why couldn't you use the s3 web hosting?
 // TODO!

## Performance considerations:

 // TODO!

perf impact of a lambda edge function in the way is about 50ms to each request...

minimize that by a) trying to have only origin request functions - only need to be run once per origin request and then cached by cloudfront - whereas viewer requests will always be run

also limit the function calls based on request type using a cloudfront behaviour

caveat: if you need to the read the host you have to use viewer request (add link here)


difference between viewer requests and origin requests...

## <a name="appendix-1">#</a>Appendix 1: Canonical urls in the address bar or in the canonical tag

Yes for the most part nowadays, specifying a {% ihighlight html %}<link rel="canonical"{% endihighlight %} is apparently sufficient to persuade google that you aren't serving multiple versions of this page (so they aren't indexed separately, or worse that you are considered to be abusing PageRank by serving duplicate content). But considering the [number of articles discussing whether 301's or canonical are sufficient](https://www.google.co.uk/search?q=redirects+or+canonical), along with search engines being very opaque about their policies leads me to prefer forcing a redirect when anyone is attempting to access a resource via a link that is anything other than the canonical.

But ultimately, I consider the url in the address bar important to be simple, readable and dependable for the customer, rather than just for the search engines. I would have to think my customers are reading {% ihighlight text %}https://nickmeldrum//cv//index.html{% endihighlight %} in the address bar instead of {% ihighlight text %}https://nickmeldrum/cv{% endihighlight %}.
