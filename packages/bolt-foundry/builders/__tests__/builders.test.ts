#! /usr/bin/env -S bff test
import { assertEquals } from "@std/assert";
import { makeSampleBuilder, makeSpecBuilder, specs, type Spec } from "../builders.ts";

Deno.test("specs API - basic usage", () => {
  const result = specs(
    "persona",
    (p) =>
      p.specs("needs", (n) =>
        n.spec("water", {
          samples: (s) =>
            s.sample("Clean drinking water", 3)
              .sample("Contaminated water", -3),
        })),
  );

  assertEquals(result.name, "persona");
  assertEquals(Array.isArray(result.value), true);

  const personaSpecs = result.value as Array<Spec>;
  assertEquals(personaSpecs.length, 1);
  assertEquals(personaSpecs[0].name, "needs");

  const needsSpecs = personaSpecs[0].value as Array<Spec>;
  assertEquals(needsSpecs.length, 1);
  assertEquals(needsSpecs[0].value, "water");
  assertEquals(needsSpecs[0].samples?.length, 2);
  assertEquals(needsSpecs[0].samples![0], {
    text: "Clean drinking water",
    rating: 3,
  });
  assertEquals(needsSpecs[0].samples![1], {
    text: "Contaminated water",
    rating: -3,
  });
});

Deno.test("SpecBuilder - spec with samples", () => {
  const builder = makeSpecBuilder();
  const result = builder
    .spec("basic")
    .spec("with-samples", {
      samples: (s) => s.sample("Good example", 2).sample("Bad example", -2),
    })
    .getSpecs();

  assertEquals(result.length, 2);
  assertEquals(result[0].value, "basic");
  assertEquals(result[0].samples, undefined);

  assertEquals(result[1].value, "with-samples");
  assertEquals(result[1].samples?.length, 2);
  assertEquals(result[1].samples![0], { text: "Good example", rating: 2 });
  assertEquals(result[1].samples![1], { text: "Bad example", rating: -2 });
});

Deno.test("SampleBuilder - various ratings", () => {
  const builder = makeSampleBuilder();
  const samples = builder
    .sample("Excellent example", 3)
    .sample("Good example", 2)
    .sample("Okay example", 1)
    .sample("Neutral example", 0)
    .sample("Poor example", -1)
    .sample("Bad example", -2)
    .sample("Terrible example", -3)
    .getSamples();

  assertEquals(samples.length, 7);
  assertEquals(samples[0], { text: "Excellent example", rating: 3 });
  assertEquals(samples[1], { text: "Good example", rating: 2 });
  assertEquals(samples[2], { text: "Okay example", rating: 1 });
  assertEquals(samples[3], { text: "Neutral example", rating: 0 });
  assertEquals(samples[4], { text: "Poor example", rating: -1 });
  assertEquals(samples[5], { text: "Bad example", rating: -2 });
  assertEquals(samples[6], { text: "Terrible example", rating: -3 });
});

Deno.test("specs API - nested structure", () => {
  const result = specs(
    "system",
    (s) =>
      s.specs(
        "components",
        (c) =>
          c.specs("database", (d) =>
            d.spec("connection", {
              samples: (s) =>
                s.sample("Persistent connection with pooling", 3).sample(
                  "Opening new connection for each query",
                  -3,
                ),
            })),
      ),
  );

  assertEquals(result.name, "system");
  const components = (result.value as Array<Spec>)[0];
  assertEquals(components.name, "components");

  const componentsValue = components.value as Array<Spec>;
  const database = componentsValue[0];
  assertEquals(database.name, "database");

  const databaseValue = database.value as Array<Spec>;
  const connection = databaseValue[0];
  assertEquals(connection.value, "connection");
  assertEquals(connection.samples?.length, 2);
});
