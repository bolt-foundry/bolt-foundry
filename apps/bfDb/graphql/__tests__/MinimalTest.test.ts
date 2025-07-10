#! /usr/bin/env -S bff test

import { assert } from "@std/assert";
import {
  extendType,
  makeSchema,
  nonNull,
  objectType,
  queryType,
  stringArg,
} from "nexus";
import { printSchema } from "graphql";

Deno.test("minimal schema test", () => {
  try {
    // Create a simple payload type
    const JoinWaitlistPayload = objectType({
      name: "JoinWaitlistPayload",
      definition(t) {
        t.nonNull.boolean("success");
        t.string("message");
      },
    });

    // Create simple query
    const Query = queryType({
      definition(t) {
        t.nonNull.boolean("ok", {
          resolve: () => true,
        });
      },
    });

    // Extend mutation type
    const Mutation = extendType({
      type: "Mutation",
      definition(t) {
        t.field("joinWaitlist", {
          type: "JoinWaitlistPayload",
          args: {
            email: nonNull(stringArg()),
            name: nonNull(stringArg()),
            company: nonNull(stringArg()),
          },
          resolve: () => ({
            success: true,
            message: "Added to waitlist",
          }),
        });
      },
    });

    // Create schema
    const schema = makeSchema({
      types: [Query, JoinWaitlistPayload, Mutation],
    });

    const sdl = printSchema(schema);
    // Schema created successfully

    assert(
      sdl.includes("type Mutation"),
      "Schema should include Mutation type",
    );
    assert(
      sdl.includes("JoinWaitlistPayload"),
      "Schema should include JoinWaitlistPayload",
    );
  } catch (error) {
    // Error handled silently
    throw error;
  }
});
