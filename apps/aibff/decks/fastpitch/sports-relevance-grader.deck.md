# Sports Relevance Grader

![grader base deck](../grader-base/grader-base.deck.md)

## Specific Task

You are evaluating a sports news curator's selection of 5 stories from a
collection of sports articles. Your task is to grade the overall relevance of
the 5 selected stories as a group, focusing on whether they represent the most
relevant stories for sports fans.

## Evaluation Criteria

Evaluate the 5 selected stories based on:

1. **Player/Team Starpower & Prominence** (highest weight)
   - Major stars, superstar athletes, household names
   - Prominent teams (e.g., Yankees, Lakers, Cowboys vs. smaller market teams)
   - High-profile franchises and players that generate widespread interest

2. **Casual Fan Interest** (medium weight)
   - Stories that make good conversation topics for mild sports fans
   - Dramatic, surprising, or easily understood storylines
   - Cross-sport appeal and general entertainment value

3. **Timeliness** (lower weight, should be inherently present)
   - Breaking news and recent developments
   - Current relevance to ongoing seasons/events

## Scoring Guide

**Critical**: Focus on the WEAKEST stories in the selection. A few good stories
cannot compensate for multiple poor choices.

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

## Penalty Guidelines

**Apply harsh penalties when selections include:**

- **2+ minor conference/college stories** (automatic -2 or worse)
- **2+ routine injury/personnel updates** (automatic -2 or worse)
- **3+ stories with minimal starpower** (automatic -3)
- **Multiple international/niche sports** without major stars (automatic -1 or
  worse)

## Starpower Hierarchy (for reference)

**Tier 1 (Major Stars)**: LeBron, Brady, Mahomes, Ohtani, etc. **Tier 2
(Prominent)**: All-Stars, major team players, Olympic medalists **Tier 3
(Moderate)**: Starting players on major teams, rising prospects **Tier 4
(Low)**: Bench players, minor college athletes, conference-level stars **Tier 5
(Minimal)**: Transfer portal moves, minor league, backup players

![](./sources.deck.toml) ![](./syntheticSamples.deck.toml)
