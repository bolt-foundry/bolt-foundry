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

- **+3**: All 5 stories have high starpower/prominence and high casual fan
  interest
- **+2**: Most stories have good starpower/prominence or interest
- **+1**: Some stories have decent relevance but others are weak
- **-1**: Most stories lack starpower/prominence and interest
- **-2**: Stories are mostly irrelevant with low starpower and little casual fan
  interest
- **-3**: All stories are completely irrelevant

![](./sources.deck.toml) ![](./syntheticSamples.deck.toml)
