# Our team story

## 7+ years building together

Our team has worked together for 7 years+ on different problems. We started with
[Vidpresso](https://techcrunch.com/2014/03/03/vidpresso-ads/), which came out of
our frustrations as video focused creators. We wanted to build technology that
would empower us with the same tools we had when we worked for large video
production teams. That eventually led our team to be
[acquired by Facebook](https://techcrunch.com/2018/08/13/facebook-vidpresso/).
After joining Facebook, we worked on a lot of different creator tooling, but
eventually found the Meta (Facebook morphed into Meta) approach stifling. We
loved working together, but eventually were unable to work with each other.

We eventually all left the company and reformed a new company Content Foundry,
with the goal of building tools to help creators take advantage of LLMs and
other innovations in AI.

## The pattern we discovered

We built a few products that gained traction, but each time we left feeling like
we couldn't build something that we were proud of. It was simple to get an
impressive tech demo, but extremely challenging to scale that into something
repeatable and interesting.

We started to ask fundamental questions: How do we know if we're doing a good
job? How can we verify our outputs are quality without having to rely solely on
[RLHF](https://arxiv.org/abs/2203.02155)? (We call that reinforcement learning
from human fingers, emphasizing how long it takes to learn.)

Through talking with some of our peers in the industry, we started to understand
methodologies used in post-training LLMs to make them useful in instruct, chat,
and now thinking models. We realized while you can apply those at fine-tuning
time, you can also apply many of the same principles at inference time.

That led to where we're at now with Bolt Foundry.

## Industry validation

We talked to a lot of our friends building LLM apps and they would say roughly
the same thing... "Our LLM isn't as reliable as we like, but it's good enough,
and we don't really know what to do to make it better."

This creates both a challenge and an opportunity for us. While "good enough"
feels sufficient to most companies today, we know that the ones who achieve 99%
reliability will dominate their markets. The companies that recognize this early
will have a massive competitive advantage, just like early adopters of web
frameworks had over those building HTML by hand.

We think a little of both is holding companies back. They don't realize that the
LLM is their core product, and they think about all the other things they could
work on. They focus on growth metrics, and not retention metrics. Also they
don't actually know what changes to make that would reliably get them to 99% so
they just accept the fact that their product is going to be some level of
shitty, and don't realize the leaky bucket effect.

## The leaky bucket effect

The "leaky bucket effect" is visible in products we've experienced. Siri is the
classic example... if it only works 90% of the time you don't build a habit with
it. Similarly, a lot of AI assisted coding tools have the same issue. Only
recently have some LLM products graduated to consistent usage because they
really are helping. [Shortwave email](https://www.shortwave.com/) is one such
example - we were ready to churn, but recently their AI assistant has gotten
noticeably better so we're giving them more of a chance.

## Why now is the right time

We think LLMs have gotten to a saturation place where the core models aren't
really changing as much as from GPT-2 to GPT-3 and GPT-3 to GPT-4... we have
some thinking models that are improving quality, but deep reasoning is more like
a for loop on LLMs, and not a fundamental advancement in the underlying model
quality like we had when we started scaling transformers. That means the biggest
place for improvement is no longer on the model side, but actually on the
inference side... driving attention more thoughtfully means that as the models
scale in size, they become more useful. If a person can give the right amount of
context instead of arbitrary context, and fill up a 1M context window then the
model will actually be better at fulfilling requests.

## Our unique background

We're journalists and content creators first. Inherently, content creation is
actually about driving attention efficiently. Being technical and a journalist
is a more rare skill, and even weirder, we're a team that has worked together
for 7+ years and we all share this background. The better we get at driving
attention the better LLMs get, and journalistic principles like inverted
pyramid, active voice, etc., all help drive attention more effectively.

## Competitive landscape

We've seen some companies like [Langchain](https://www.langchain.com/) come up
with attempts at more structured prompts, but ultimately most libraries are
leaky abstractions. [Rails](https://rubyonrails.org/) makes it so you can
literally know nothing about SQL and get decent results. Langchain and
[DSPy](https://github.com/stanfordnlp/dspy), etc., kind of expect you understand
a lot about the underlying model and don't help you really get a sense of what
to fix, or how to drive attention.

## Market reception

We've seen a lot of interest in making prompts more reliable and consistent.
Each time we give a solution though, we're not able to get peoples' interest
captured because there's a lot of activation energy. There's also a lot of
skepticism generally-- "LLMs are the hottest thing right now, why hasn't anyone
thought of this?"

## Our approach

We really think the execution is the key. Being right in this case matters a lot
more than being first. We want to help people build better stuff, and we want to
work together as friends. We think this is a big opportunity with strong network
effects — as more developers use structured prompts, the shared libraries and
best practices become more valuable for everyone. This is fundamental
infrastructure that has a shot at being a big company like Microsoft... an
operating system for LLMs, like Microsoft was an OS for Altair and IBM.
