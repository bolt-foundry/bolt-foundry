# Show HN: A big tech dev experience for an open source CMS.

Hey HN! We're building an open-source CMS designed to help creators with every
part of the content production pipeline.

We're showing our tiny first step: A tool designed to take in a Twitter username
and produce an "identity card" based on it. We expect to use an approach similar
to [Constitutional AI] with an explicit focus on repeatability, testability, and
verification of an "identity card." We think this approach could be used to
create finetuning examples for training changes, or serve as inference time
insight for LLMs, or most likely a combination of the two.

The tooling we're showing today is extremely simplistic (and the AI is frankly
bad) but this is intentional. Right now, we're more focused on showing the dev
experience and community aspects we hope to achieve. We'd like to make it easier
to contribute to this project than edit Wikipedia. Communities are frustrated
with things like Wordpress, Apache, and other open source foundations focusing
on things other than software. We have a lot of community ideas (governance via
vote by jury is perhaps the most interesting) and look forward to finding folks
who are interested in this space.

We're a team of 5, and we've bounced around a few companies with each other.
We're all professional creators (video + music) and we're creating tooling for
ourselves first.

Previously, we did a startup called Vidpresso (YC W14) that was acquired by
Facebook in 2018. We all worked at Facebook for 5 years on creator tooling, and
have since left to start this thing.

After leaving FB, it was painful for us to leave the warm embrace of the
Facebook infra team where we had amazing tooling to do things like spin up
devservers, custom source control plugins, and generally world-class tooling
build by world-class engineers.

Since then, we've pivoted a bunch of times trying to figure out our "real"
product. While we think we've finally nailed it, the developer experience we
built is one we think others could benefit from.

Our tooling is designed so a developer (or regular human!) of any skill level
can easily jump in and start contributing. It's an AI-first dev environment
designed with a few key principles in mind:

1. You should be able to discover any command you need to run without looking at
   docs.
2. To make a change, as much context as possible should be provided as close to
   the code as possible.
3. AIs are "people too", in the sense that they benefit from focused context,
   and not being distracted by having to search deeply through multiple files or
   documentation to make changes.

We have a few non-traditional elements to our stack which we think are worth
exploring.

1. [Isograph] is a relatively new frontend data fetching and state management
   framework. It's built by a great friend who formerly worked on the relay team
   at Facebook. It's a way to associate components directly with a GraphQL
   schema. Just like GraphQL / Relay, it generates (really great) typescript
   types, and their compiler / codegen keeps things safe generally.

   For us, the benefit is we can colocate not only fragments, but avoid Fragment
   spreads, passing around state, etc. It's possible to reason about a file /
   component completely in isolation, more than we've found with Relay. Its "I
   have no graphql experience" onboarding process is the best we've seen thus
   far.

2. [Replit] is better known as a "tinkerer's tool," but we've been using it as a
   production grade replacement IDE, hosting platform, and development tooling
   experience for over a year now. We've found it the most comforting
   combination of "little lock-in", customizable experience, and thoughtfully
   designed product that's accessible for anyone to use.

   Most importantly, for us anyway, is it lets people use AI coding without
   needing to set up any additional tooling. Its out-of-the-box assistant is
   based on Sonnet 3.7, and tends to do a decent (or better) job at making
   changes. We've learned how to treat it like a junior developer, and think it
   will be the best platform for AI-first open source projects going forward.

3. [Sapling] and Git together for version control. It might sound counter
   intuitive, but we use Git to manage agent interactions (ie rollback and the
   sort) and we use Sapling to manage "purposeful" commits. We'll explain more
   about this over time... but trust us it helps with developer velocity and
   collaboration.

My last [Show HN post in 2013] ended up helping me find my Vidpresso cofounder,
Pauli Ojala, so I have high hopes for this one. I'm excited to meet anyone,
developers, creators, or nice people in general, and start to work with them to
make this project work. I have good references of being a nice guy, and aim to
keep that going with this project.

The best way to work with us is [remix our Replit app], [join our Discord], and
[follow us on Twitter]. I'll be hanging out in voice chat on Discord, coding,
and whatnot, if you want to come make fun of me. :)

Thanks for reading and checking us out! It's super early, but we're excited to
work with you!

[Constitutional AI]: https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback
[Isograph]: https://isograph.dev
[Replit]: https://replit.com
[Sapling]: https://sapling-scm.com
[Show HN post in 2013]: https://news.ycombinator.com/item?id=6993981
[remix our Replit app]: https://replit.com/t/bolt-foundry/repls/Content-Foundry/view#README.md
[join our Discord]: https://discord.gg/TjQZfWjSQ7
[follow us on Twitter]: https://x.com/contentfoundry_
