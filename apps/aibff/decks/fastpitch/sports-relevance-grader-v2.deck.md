# Sports Relevance Grader V2

![grader base deck](../grader-base/grader-base.deck.md)

## Specific Task

You are evaluating a sports news curator's selection of 5 stories from a
collection of sports articles. Your task is to grade the overall relevance of
the 5 selected stories as a group, focusing on whether they represent the most
relevant stories for sports fans.

**Response Format**: Provide your evaluation as valid JSON with "score" and
"reason" fields. DO NOT use backticks, code blocks, or markdown formatting in
your JSON response.

## Evaluation Criteria

Evaluate the 5 selected stories based on:

1. **Player Starpower & Team Prominence** (highest weight)
   - Major stars, superstar athletes, household names (e.g., LeBron, Brady,
     Mahomes)
   - Prominent teams (e.g., Yankees, Lakers, Cowboys vs. smaller market teams)
   - High-profile franchises and players that generate widespread interest
   - **Golf majors are TIER 1**: U.S. Open, Masters, PGA Championship, British
     Open winners have HIGH starpower and broad appeal - NEVER penalize major
     wins
   - **U.S. Open victories are HOUSEHOLD NAME events**: Treat golf major wins
     exactly like MLB All-Star trades or NBA Finals - they are water cooler
     moments
   - **Golf expert picks/predictions are LOW starpower**: Distinguish between
     major tournament victories (tier 1) and routine PGA predictions/analysis
     (penalty)
   - **Be strict**: Stories about minor players, college transfers, or truly
     niche sports have LOW starpower
   - **Critical**: Star power DOES NOT redeem trivial stories - even major stars
     apologizing or other non-substantive content should be penalized

2. **Casual Fan Interest** (medium weight)
   - Stories that make good conversation topics for mild sports fans
   - Dramatic, surprising, or easily understood storylines
   - Cross-sport appeal and general entertainment value
   - **Avoid over-crediting**: Routine updates, injury returns, and minor
     personnel moves have LOW interest

3. **Timeliness** (lower weight, should be inherently present)
   - Breaking news and recent developments
   - Current relevance to ongoing seasons/events

## Scoring Guide

**Critical Rules**:

- Judge by the WEAKEST stories. One superstar cannot save a selection with
  multiple weak stories.
- **MANDATORY COUNTING**: Use the weak story checklist - if 4+ stories are weak,
  MUST be -3
- **Never downgrade from -3 to -2**: If you count 4+ weak stories, score MUST be
  -3
  - **Boundary tie-breaker**: When between +1 and -1, count tier 1 stories:
  - 3+ tier 1 stories = +1
  - 1-2 tier 1 stories = -1
- **Consistency check**: If 4+ stories are genuinely tier 1 content, score
  should be +2 or +3
- **Avoid over-penalizing**: Don't dock points for legitimate major sports
  content

- **+3**: All 5 stories feature major stars/teams AND have high casual fan
  interest
- **+2**: 4+ stories have genuine starpower/prominence AND strong interest
  **Note**: Golf majors, MLB All-Star trades, NBA Finals, Stanley Cup = tier 1
  content
- **+1**: EXACTLY 3 stories are tier 1/strong relevance, 2 are weak
- **-1**: Only 1-2 stories have genuine starpower, 3+ are weak/routine content

**Boundary Rule**: When counting stories, use these strict categories:

- **Tier 1**: NBA Finals content, Olympics with major stars, major trades,
  championship games
- **Weak**: Injury reports, WNBA routine content, commentary/reactions,
  retrospective lists
- **-2**: Exactly 3 weak stories from the list above, some redeeming content
- **-3**: 4+ weak stories from the mandatory list - ALWAYS use -3, never -2
  **COUNTING RULE**: Transfer portal + minicamp + tennis non-star + WNBA
  routine + Biles controversy = 5 weak stories = MANDATORY -3

## Instant Negative Triggers

**MANDATORY SCORING RULES - COUNT THE WEAK STORIES:**

**Step 1: Count stories that are ANY of these:**

- Transfer portal/college minor moves
- Routine injury reports/minicamp updates
- Non-household names in tennis/minor sports
- WNBA routine content (unless major star/historic moment)
- Trivial celebrity controversies (even with major stars like Simone Biles)
- Expert picks, schedules, commentator news

**Step 2: Apply MANDATORY scoring:**

- **3+ weak stories** → MANDATORY -2 or worse
- **4+ weak stories** → MANDATORY -3 (not -2)
- **5 weak stories** → MANDATORY -3

**Examples requiring -3:**

- Transfer portal + minicamp + tennis non-star + WNBA injury + Biles controversy
  = 5 weak = -3
- Expert pick + commentator + schedule + injury + college = 5 weak = -3

## Examples of LOW starpower (should trigger penalties)

- Transfer portal moves, minor league players
- Conference-level awards, backup players
- Routine injury returns, minicamp updates
- Lesser-known international athletes
- **Trivial celebrity stories**: Apologies, social media posts, minor
  controversies involving stars from lower-tier sports (gymnastics, tennis,
  etc.)
- **Nothing stories with star names**: Even major athletes cannot redeem
  substantively empty content

## TIER 1 Content (DO NOT PENALIZE)

- **Golf majors**: U.S. Open, Masters, PGA Championship, British Open victories
- **MLB**: All-Star trades, playoff games, major signings
- **NBA**: Finals games, superstar moves, playoff drama, **Finals injury reports
  for star players**
- **NFL**: Major trades, playoff games, star signings
- **NHL**: Stanley Cup games, major trades
- **Tennis**: Grand Slam victories (Wimbledon, US Open, French Open, Australian
  Open)
- **Olympics**: Team announcements with major stars (Matthews, McDavid level
  players)

## WEAK Content (TRIGGERS PENALTIES)

- **WNBA routine content**: Unless Caitlin Clark or truly historic moments
- **Injury reports**: Unless Finals/playoff context with major stars
- **Commentary/reactions**: Retired players commenting on trades
- **Retrospective lists**: All-time teams, historical rankings without current
  news value

![](./sources.deck.toml) ![](./syntheticSamples.deck.toml)
