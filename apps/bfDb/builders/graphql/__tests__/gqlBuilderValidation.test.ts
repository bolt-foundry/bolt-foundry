#! /usr/bin/env -S bff test
import { assertThrows } from "@std/assert";
import { gqlSpecToNexus } from "../gqlSpecToNexus.ts";
import { BfPerson } from "../../../nodeTypes/BfPerson.ts";

Deno.test(
  "gqlSpecToNexus validates relations against bfNodeSpec",
  () => {
    // BfPerson defines a memberOf relation in its GraphQL spec
    // but BfPerson.bfNodeSpec currently lacks this relation.
    // Once validation is implemented, converting this spec should throw.
    assertThrows(
      () => {
        gqlSpecToNexus(BfPerson.gqlSpec, "BfPerson");
      },
      Error,
    );
  },
);
