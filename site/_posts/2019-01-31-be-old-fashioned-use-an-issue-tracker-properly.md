---
layout: default
title: "Be old fashioned: Use an issue tracker properly!"
shortDescription: "Be the historian"
date: 2019-01-31 22:57:26
comments: true
---

![Be the historian](/assets/images/historian.jpg)

Note: this article is not specific to JIRA, though it's mentioned, it is just pretty prevalent as an "issue/story tracking tool" in my circles. It's a bit like talking about how to hoover instead of vacuum. (Apologies to Dyson.)

## Picture the scene:

I land a new client and turn up on day 1, immediately seeing some typical problems. Long builds, pipelines failing, flaky e2e tests, architectural principles ignored and bugs a plenty. Nothing strange here, most projects I see have most if not all these issues to a greater or lesser extent. I start asking about why decision a) or b) was made as it seems to me to be problematic and I think I can improve things by trying c) or d) instead.

> Yeah, don't change that. I remember we had to do that about 6 months ago to fix something, but I can't remember what.

Okay, I think, I'll have a look at the code that was changed and read the commit history and hopefully read the attached JIRA ticket to understand the decision making process at the time. (For the idly interested, this is sometimes known as "Chesterton's Fence". Simply put: don't tear down a fence in a field until you know why it was put up in the first place. For the far better worded original quote from a G. K. Chesterton book see the [wikipedia entry](https://en.wikipedia.org/wiki/Wikipedia:Chesterton%27s_fence).)

![Fences are put up for a reason](/assets/images/fence.jpg)

I go read the commit history and it says: "JIRA-42: Change to use library function x instead of y". This isn't a great commit message but it's not terrible either on the face of it. It mentions the ticket under which this work falls and states what it does. Notice it doesn't say why.

So I go read JIRA number 42 and the description says: "We must change to use library function x instead of y". And that's it. No acceptance criteria, no reason why we have to change, no problem to solve. No comments or discussion on it.

I wonder if the discussion happened on the PR so track that down. Nope, instead we get discussions on whether we should be using arrow functions or whether this should be a class or a function etc. i.e. PR's often focus on the implementation instead of the "why are we even making this change."

This is not a rare story. In fact it's quite common. I try to show perhaps why it's so common in the "Why is writing a good ticket so hard?" section below.

![Stuck in a quagmire](/assets/images/quagmire.jpg)

## Stuck in a quagmire

So now there is no way for me to understand why this was done in the first place. Everyone is too scared to change it and gun shy of large changes because of the pain they've been having. I now have 2 choices:

 1. Stay paralysed by fear of changing anything lest I unleash previous demons
 2. Charge ahead forward and either succeed or look like an idiot because "we told you not to change that"

I of course will elect no. 2 - but I sure wish I could work more professionally than that and understand why the fence was there in the first place before removing it and replacing it with a cattle grid. This might save us from significant time and wasted effort.

## The answer

There is not just 1 answer of course, but here is a potential solution:

As a developer, see yourself as the historian as well as the technical writer of your own work. Documentation does of course rot, but it is also extremely useful over time. Sometimes it's useful even after it has become out of date.

![Tickets, tickets, tickets!](/assets/images/tickets.jpg)

If you are writing a new subsystem on, for instance, how to allow Redux actions to fire of google tag manager datalayer events for analytics, document in a README how it should be used. This will help the next developer use your system in the future. The real motivator here is that it will make the next developer respect you that much more as a professional and a useful colleague.

If you are having to change a codebase for any reason whatsoever, whether it be customer facing functionality or a technical issue it should be done under a "ticket". That ticket should be well documented - a record of why we are making the change with as much detail as possible. No one will be upset by you writing too much detail. It is incredibly frustrating however, for other people coming along afterwards or even at the same time, to not have pertinent information about the change recorded in some fashion.

I have a template that I sometimes recommend people use, but templates can be problematic in themselves as they can lead people to stop thinking. Instead the best way to think about what to put in a ticket is to cover these bases:

 1. Add some background. I need to know what has happened in order to get us to this place that this change is required.
 2. Describe the problem. NOT the solution. I need to know WHY you feel you need to make this change. This is number 1 the most important thing to write down.
 3. Describe how we are going to prove we succeeded. This is number 2 the next most important thing and MUST not be left off. So many good behaviours lead on from being very specific about how we know when we are "done".
 4. Important decisions/ lessons along the way are very useful to document to. Be the historian.

## A quick aside on remote working, "working from home" and distributed teams

If you have any type of remote workers or distributed (i.e. multi-site) teams this process is even more important to respect. It means there will definitely be people "out of the loop" with regards to face to face discussions and context. Help them out by adding the context they need onto a ticket so anyone can just read a ticket to know how to help or jump in to a piece of work.

![Working from home](/assets/images/working-from-home.jpg)

On the flip side, encouraging remote working can actually be a way of encouraging a team to communicate in a way that means they show better "JIRA" behaviour. You are forced to communicate in a different way rather than relying on all being in the same place and chatting. They will start to use tickets, PRs, slack and other excellent forms of written communication that are useful as they are public and searchable.

Note I didn't mention email. Email is the worst of all worlds. It's not public and searchable so it's of no use to the future team, and it has none of the benefits of face to face communication. Just stop using it for team work.

## Why is writing a good ticket so hard? Why is this simple and obvious responsibility not met?

Lots of modern principles, taken to extremes, actually persuade us against doing this.

> Documentation rots, I prefer just to write code that explains itself.

There is truth in this as in all these principles. Of course we should write intentional code. We should write function names saying exactly precisely what the function is doing. We should write variable names explaining precisely what they represent. But to use this heuristic to argue that we don't need better tickets and better commit messages is to misuse this principle. Good function names and variables names won't help me understand why we chose to "do things this way" or what business drivers or painful technical processes we were experiencing at the time. There is so much more context necessary than merely the code can impart.

In short, don't take this principle to it's extreme. Don't throw out the baby with the bath water!

> We are co-located and value face to face communication.

Great, talking to people face 2 face is a great way to communicate. It allows us to to feel the humanity in both parts of the discussion and have a much more positive collaborative experience. It *can* help us get to an understanding more quickly because it's a much faster way for a couple of people to have a back and forth. However, without being the historian of these discussions, and documenting discussions and decisions this information is stuck only in your head and lost. So, have the discussion face 2 face, then be a professional and quickly write down a synopsis of the discussion in the ticket. Then you can get the best of both worlds!

In short, don't take this principle to it's extreme.

![Don't take things to the extreme](/assets/images/extreme.jpg)

> We just use commit messages and/ or PR discussions for this.

Okay, this *could* work for some teams. Your mileage may vary. Some of the reasons that we need tickets, even for non functional stuff, instead of relying solely on commit history:

 1. It's useful for the non-technical members of the team. They don't read commits.

 2. Our focus is usually different at the point of writing commit messages and PR discussions. It's usually more centered around the technical implementation than the "why" or the background to the work

 3. We are usually terser in commit messages and tickets allow us a more free form space to add more context and discussion.

In short, don't take this principle to it's extreme.

> We aren't going fast enough, this is just waste and not lean.

I think there can be great value in using lean principles and removing waste. Let's be clear about what waste is though. The extreme viewpoint of "anything that doesn't directly lead to this requirement being shipped" is a good way of understanding waste, but if taken literally would mean a whole host of useful and necessary activity that a development team does is lost.

I am arguing naturally that defining a task well in a ticket is NOT waste. In fact, how can you know what is waste and what isn't in a specific task if you haven't clearly identified why you are doing the ticket and the success criteria for the work?

In short, don't take this principle to it's extreme. Do you see a pattern here? :)

> We are a small enough team that we don't need all this formal corporate process nonsense.

Even on my pet projects with a team size of 1 or sometimes 2 I find documenting my work well in each ticket extremely useful. Plenty of tasks we have to come back to and revisit either because we had to reprioritise or because we want to iterate on a previous bit of work. To know and remember the previous decision making process saves a whole load of time and waste. Team size doesn't change this fact.

## To sum up...

![Be the professional](/assets/images/professional.jpg)

Be the historian. Be the professional and document why we are doing what we are doing, how we know we have succeeded and what happened along the way. It will help you and your team next week, as well as in 6 months time I assure you.

