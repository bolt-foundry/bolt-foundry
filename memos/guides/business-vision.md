# Bolt Foundry business vision

## Revenue model

We will charge a monthly subscription fee for credits that expire each month.
This credit-based system enables usage-based pricing while providing predictable
revenue:

- **Event Storage**: Each stored event (prompts, responses, interactions)
  consumes credits
- **Inference Services**: Token-based fees for services like reconciling samples
  against persona/behavior cards
- **Advanced Analytics**: Batch evaluations, performance analysis, and
  optimization services
- **Potential LLM Intermediary**: Similar to
  [OpenRouter](https://openrouter.ai), though value proposition still being
  evaluated

This model follows successful precedents like [Replit](https://replit.com),
allowing us to charge based on value delivered while giving flexibility in
credit allocation for different customer types.

## Go-to-market strategy

### Primary: developer-led growth + content marketing

Our core strategy leverages our team's content creation background:

- **Educational Content**: Blog posts explaining structured approaches to prompt
  engineering
- **Thought Leadership**: Podcasts, speaking engagements, and industry
  discussions about structured prompt engineering
- **Developer Community**: Building relationships with LLM application
  developers through valuable insights
- **Open Source Evangelism**: Using our open source tools as entry points for
  deeper engagement

### Distribution channels

**Open Source + Freemium Model:**

- Core prompt restructuring CLI tool available open source
- Basic evaluation capabilities provided free
- Advanced features (batch evaluations, enterprise analytics) monetized
- Natural progression from individual developer tools to team/enterprise
  features

This aligns with our "Gradual Adoption" principle from our
[company vision](./company-vision.md), allowing developers to experience value
before committing to paid services.

## Customer acquisition funnel

1. **Awareness**: Content marketing and thought leadership establish our
   expertise
2. **Trial**: Developers use free CLI tool to restructure existing prompts
3. **Value Realization**: Basic evaluations demonstrate improved prompt
   reliability
4. **Conversion**: Teams need batch processing, advanced analytics, or
   collaboration features
5. **Expansion**: Enterprise customers require enhanced security, support, and
   custom integrations

## Market strategy

### Early stage: developer tools

Focus on individual developers and small teams experiencing prompt reliability
issues. Provide immediate value through prompt restructuring and basic
evaluation tools.

### Growth stage: team platforms

Expand to development teams needing collaboration, version control, and shared
prompt libraries. Add team management and advanced analytics features.

### Mature stage: enterprise infrastructure

Become the standard for mission-critical LLM applications requiring
enterprise-grade reliability, security, and compliance.

## Competitive positioning

Unlike existing solutions ([LangChain](https://langchain.com),
[DSPy](https://dspy-docs.vercel.app)) that are "leaky abstractions" requiring
deep model knowledge, we provide true abstraction similar to
[Rails](https://rubyonrails.org) hiding SQL complexity. Our structured approach
to prompt reliability is unique in the market.

We compete on:

- **Ease of use**: No deep LLM knowledge required
- **Reliability**: Structured approaches create more consistent outputs
- **Developer experience**: Familiar patterns and gradual adoption paths
- **True abstraction**: Hide complexity rather than expose it

## Financial philosophy

We prefer bootstrapping toward ramen profitability over raising large amounts of
capital. This approach:

- Maintains focus on customer value over growth metrics
- Preserves optionality for future funding or strategic decisions
- Aligns with our team's preference for sustainable, collaborative work
- Forces discipline around product-market fit before scaling

We're open to funding if it accelerates our mission to help people build better
LLM applications, but not dependent on it for survival.

## Success metrics

**Revenue Metrics:**

- Monthly Recurring Revenue (MRR) growth
- Credit consumption patterns and trends
- Customer Lifetime Value (LTV) vs Customer Acquisition Cost (CAC)

**Product Metrics:**

- CLI tool adoption and usage frequency
- Conversion from free to paid features
- Prompt reliability improvements measured by customers

**Market Metrics:**

- Developer mindshare in LLM engineering communities
- Content engagement and thought leadership recognition
- Open source project adoption and contributions

## Business risks

| Risk                                      | Description                                                                                                                                    | Current Mitigation Approach                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Big Tech Competition**                  | Companies like OpenAI, Anthropic, or Google building similar developer tools and bundling them with LLM services                               | Position as "Switzerland of LLM providers" - vendor-neutral tooling that helps developers avoid lock-in. Platform bundling creates counter-demand for independent solutions. Leverage focused team composition to outbuild typical big company efforts (10-vs-5 dynamic, not 200-vs-5).                                     |
| **Incumbent Ecosystem Entrenchment**      | Existing tools like LangChain/DSPy having deep market penetration, making adoption difficult despite technical superiority                     | Focus on early adopters who love the product, then expand outward ([demand shaped like a well](https://paulgraham.com/startupideas.html)). Make our tooling "as easy to use as not use" so our baseline becomes the new "good enough." Address our inexperience with developer tooling through direct customer development. |
| **Wrong Abstraction Level**               | Building too high-level (developers want primitives) or wrong dimension entirely (focusing on prompts when real pain is deployment/monitoring) | Direct customer development with developers experiencing active pain points. Follow complaint patterns in developer communities to validate abstraction choices early.                                                                                                                                                      |
| **Minimum Viable Revenue Identification** | With limited runway, must quickly identify which features developers will pay for immediately vs. find intellectually interesting              | Focus validation on debug tools (heatmaps, backtesting, synthetic data generation) and advanced evaluations/A-B testing as leading candidates. Use direct customer development and following developer pain points for rapid validation.                                                                                    |
| **Revenue Generation Timeline**           | Converting interest to paid customers fast enough to extend runway while operating with minimal resources                                      | Balance speed-to-revenue with product quality sufficient to retain early customers and build word-of-mouth growth. Target individual developers for faster sales cycles.                                                                                                                                                    |
| **Resource Allocation Under Constraints** | Staying lean while potentially lacking expertise in developer tooling, requiring focus without capability gaps                                 | Run fast, cheap, and build great things people really need. Focus entirely on core prompt lifecycle management value proposition without getting distracted by adjacent opportunities.                                                                                                                                      |

## Long-term vision

We see multiple paths to success:

- **Large Company**: Becoming the "Microsoft for LLMs" - the standard operating
  system for LLM development
- **Major Open Source Project**: Driving industry standards while monetizing
  enterprise services
- **Strategic Acquisition**: Providing core infrastructure for larger platforms

Our priority is building something important that helps developers create more
reliable LLM applications, regardless of the specific business outcome.
