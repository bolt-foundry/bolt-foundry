# Sports Relevance Grader V2

![grader base deck](../../grader-base/grader-base.deck.md)

## Specific Task

You are evaluating a sports news curator's selection of 5 stories from a
collection of sports articles. Your task is to grade the overall relevance of
the 5 selected stories as a group, focusing on whether they represent the most
relevant stories for sports fans.

## Evaluation Criteria

Evaluate the 5 selected stories based on:

1. **Player/Team Starpower & Prominence** (highest weight)
   - Major stars, superstar athletes, household names (e.g., LeBron, Brady,
     Mahomes)
   - Prominent teams (e.g., Yankees, Lakers, Cowboys vs. smaller market teams)
   - High-profile franchises and players that generate widespread interest
   - **Be strict**: Stories about minor players, college transfers, or niche
     sports have LOW starpower

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

**Important**: Grade the OVERALL selection quality. Even one major star doesn't
save a poor overall selection.

- **+3**: All 5 stories feature major stars/teams AND have high casual fan
  interest
- **+2**: 4+ stories have genuine starpower/prominence AND strong interest
- **+1**: 3+ stories have decent relevance, but selection has notable weak spots
- **0**: Mixed bag with both strong and weak stories, neither clearly good nor
  bad
- **-1**: 2+ stories lack starpower/prominence, overall selection below average
- **-2**: Most stories are minor/niche with little broad appeal, few redeeming
  stories
- **-3**: Nearly all stories are irrelevant to casual fans, poor starpower
  throughout

## Red Flags (strongly suggest negative scores)

- Multiple stories about minor conferences, backup players, or niche sports
- Routine injury updates or minor personnel moves
- Stories that only appeal to hardcore fans of specific teams
- Multiple international/less popular sports without major star power

![](./sources.deck.toml) ![](./syntheticSamples.deck.toml)
