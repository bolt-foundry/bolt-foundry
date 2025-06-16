aibff grader generate -- create grader from sample data (json or whatever) --
creates sources.deck.toml grader.deck.md aibff grader calibrate -- calibrate a
grader by running it and reflecting the disagreements, offers suggestions on how
to fix aibff grader refine -- takes sources, runs calibration, then suggests
updates or automatically updates them, rerun refine with synthetic.deck.toml to
integrate new scenarios and add then to sources.toml aibff grader synthesize --
reads the grader and creates syntheticSources.deck.toml, which is synthetic data
created for updating the grader.

> aibff grader compare -- run the grader against multiple LLMs

aibff eval -- run an eval completions api match against some input file, or
stdin, and returns ??? some sort of grading report as toml

> aibff sources add -- add a new bit of info to the source toml aibff sources
> remove -- remove a bit of info from the source toml

aibff prompt generate -- creates a prompt from the grader aibff prompt
synthesize -- syntheticSamples.deck.toml

> aibff prompt grade -- generate synthetic data, and grade it, and give
> suggestions

aibff prompt refine -- refine from a grading result aibff prompt render --
create a openai compatible object aibff prompt heatmap -- take a completion, and
attempt to heatmap check it -- first this is impossible without our approach
(most speculative) aibff prompt compare -- take two prompt decks and run them
through the grader in parallel

take the output of deno info eval.ts and turn it into an array of includes

| Priority | i | e | ieq | Namespace | Action     | Inputs                        | Description                                                                                                                                                   |
| -------- | - | - | --- | --------- | ---------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| p🔥      | 3 | 3 | 1   | eval      | (default)  | input file or stdin           | Runs a completions API match and returns a grading report (TOML format)                                                                                       |
| p0       | 2 | 1 | 2   | grader    | calibrate  | grader + eval results         | Calibrates a grader by reflecting disagreements and suggesting improvements                                                                                   |
| p1       | 3 | 1 | 3   | *         | *          | *                             | notify users we collect telemetry / add telemetry opt out in the toml / env var. Only collect command invocations without any metadata of the filenames, etc. |
| p1       | 3 | 1 | 3   | *         | *          | *                             | Collect telemetry in our collector endpoint not posthog native                                                                                                |
| p1       | 2 | 1 | 2   | grader    | compare    | multiple LLM outputs          | Runs grader against outputs from multiple LLMs and compares them                                                                                              |
| p1       | 3 | 2 | 2   | grader    | generate   | sample data (JSON or similar) | Creates `sources.deck.toml` and `grader.deck.md` from sample data                                                                                             |
| p1       | 3 | 3 | 1   | grader    | refine     | sources + eval results        | Refines the grader by running calibration, updating sources or grader, possibly auto-updating                                                                 |
| p2       | 3 | 2 | 2   | prompt    | grade      | grader + synthetic data       | Grades synthetic data and suggests improvements                                                                                                               |
| p2       | 3 | 2 | 2   | prompt    | generate   | grader                        | Creates a prompt from the grader definition                                                                                                                   |
| p2       | 1 | 3 | 0   | grader    | synthesize | grader.deck.md                | Generates `syntheticSources.deck.toml` for new scenarios                                                                                                      |
| p2       | 1 | 3 | 0   | prompt    | synthesize | grader or deck                | Generates `syntheticSamples.deck.toml`                                                                                                                        |
| p2       | 3 | 3 | 1   | prompt    | refine     | grading result                | Refines prompt based on grading result                                                                                                                        |
| p2       | 3 | 1 | 3   | prompt    | render     | grader or deck                | Outputs OpenAI-compatible prompt object                                                                                                                       |
| p3       | 1 | 1 | 1   | sources   | remove     | existing info ID              | Removes an item from the `sources.toml`                                                                                                                       |
| p3       | 1 | 1 | 1   | sources   | add        | new info                      | Adds a new item to the `sources.toml`                                                                                                                         |
| p3       | 3 | 3 | 1   | prompt    | heatmap    | completion                    | Generates a speculative heatmap of grading decisions (speculative)                                                                                            |
| p3       | 3 | 3 | 1   | prompt    | compare    | two decks                     | Compares prompt decks by running them through the grader in parallel                                                                                          |

<!-- TBLFM: @I$4..@>$4=($2/$3);%.0f -->

- no npx,
- no installer,
- github release running on x64 linux, arm64 mac and demand people do wsl for
  windows

if you have a deck which references toml, you can:

1. `bff calibrate $GRADER.deck.md`
   1. uses sources.deck.toml which is referred to from the grader.md as an embed
2. `bff eval --input x.jsonl $GRADER.deck.md`
   1. Uses native openai completions format, finds the last user turn and
      assistant turn to grade.
   2. Should stream from the input x.jsonl file instead of reading the whole
      file in memory
3. `bff grader compare`
   1. llm comparison for disagreement profiles

bff eval bff-eval bff $FRIEND bff ai $FRIEND ./apps/aibff/eval.ts

aibff replaces bff ai, eval, bff-eval <-- robots bff $friend <-- humans aibff
team <-- bff ai replacement

aibff eval aibff grader * aibff team summary aibff team pingping aibff repl
aibff dev commit/serve/ start / build / whatever

bff dev commit <-- humans run if they want to manually do what an ai does
magically

generate unique id for each install / user / system and drop in XDG_CONFIG_HOME
as aibff.toml
