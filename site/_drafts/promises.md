---
layout: default
title: "AWS node and unfulfilled promises"
ShortDescription: "What is up with this .promise() method in the aws node sdk?"
---

A colleague came up to me the other day to ask me 2 very good questions:

> "Why does the AWS node sdk have this `.promise()` function that you can chain onto all it's methods? Why doesn't it just return a promise by default?"

and

> "How do they do that? (support both callbacks by default *and* a `.promise()` method)"

I realised these were 2 excellent questions to trigger an explanation of why we are where we are with promises and node. Maybe that can help us understand node and promises a bit better along the way.

On researching this topic I learnt about a fascinating issue with node and Promises. So this one's for you, Ravish!


## Let's deal with the 1st question first:

"Why doesn't the AWS node sdk just return a promise by default?" The answer to that is quite simply: Because the node community has a convention of dealing with async code using callbacks. Sticking to this convention helps interoperability. So the next question is obviously "Why does it have this convention and hasn't yet moved to using Promises as it's convention?" That's where things get interesting.

## Let's remember the node callback conventions

By default (as nodejs is of course asynchronous by default) node has a [callback convention](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/) called the "error-first" callback, cutely named the 'errorback'.

The convention is a form of continuation passing style that states:

> "The last argument you pass us will be a callback function that expects it's 1st argument to be the error object and the rest of the arguments are the result."

> "You have to check the err object in your callback. If it's null, you can assume success, If it isn't you can now deal with the error scenario"

For example:

{% highlight javascript %}
fs.readFile('foo', (err, data) => {
  if (err) {
    // do something in the error scenario
    return
  }

  // err was null so you can now operate on data
})
{% endhighlight %}

This is how Node.js accomplishes what Promises promises to do: Help async functions deal with return values and errors. This makes allowing a function higher up the callchain to deal with this error quite problematic. You would have to ensure the error is always passed up the callchain. It's possible, but you must manually implement your own implicit error propagation mechanism to manage it. A major problem is: what if some code in the middle decides to throw? This mechanism essentially means you are dealing with error propagation by passing errors up adn therefore cannot throw ever.

## let's remember the point of promises

(Hint: It's not about callback hell. That can be solved much more easily without introducing a complicated and problematic paradigm such as Promises. Just look to the excellent [async](https://www.npmjs.com/package/async) library for instance.)

 from: ["You're missing the point of promises"](https://gist.github.com/domenic/3889970)

 > "The point of promises is to give us back functional composition and error bubbling in the async world. They do this by saying that your functions should return a promise, which can do one of two things:
 >
 > * Become fulfilled by a value
 > * Become rejected with an exception
 >
 > And, if you have a correctly implemented then function that follows Promises/A, then fulfillment and rejection will compose just like their synchronous counterparts, with fulfillments flowing up a compositional chain, but being interrupted at any time by a rejection that is only handled by someone who declares they are ready to handle it."


So Promises help us with 2 significant problems when dealing with asynchronous code: 1. composing functions (having 1 function consume the return value from a previous function basically) and 2. allowing a function in that chain to interrupt the flow, aborting the current control flow and allowing anyone higher up the chain to deal with it.

This is clearly important and useful functionality. And that explains why Promises *are* widely used in business code written in nodejs. It doesn't explain then why nodejs hasn't adopted them by default as the mechanism for dealing with asynchronous code.

## What about async/await

Async/await are syntactic sugar on top of Promises, so all the issues talked about here surrounding Promises will also be the case when talking about async/await.

## So why is node still callbacks by default

TODO: research node with references abou why library authors don't offer callbacks by default - presumably because it's "conventional to supply callbacks; because the node sdk uses callbacks; - other reasons?
1 reason: post-mortem analysis of processes - no core dump in promises
   https://github.com/nodejs/node/pull/15335

   https://github.com/nodejs/post-mortem/issues/45


> For those new to these discussions, to summarize the problem again most concisely: postmortem debugging with --abort-on-uncaught-exception collects the entire JavaScript and native state of the program (including all threads) in the precise context of the failure (so that stack state is preserved) with zero runtime cost until the failure happens, while promises explicitly specify that the program must continue executing after the point of the failure, meaning that state is necessarily mutated. Forking is the closest thing to having it both ways, but it has all of the drawbacks brought up here -- it's a heavy cost and it doesn't include all of the same state.

references:

 *  https://github.com/nodejs/promises/issues/26 - unhandled rejection behaviour
https://github.com/nodejs/node/issues/830

## How does node

(TODO: find other potential blog idea - was from a chat history in teams? was it about common libs?)
