import { scalarType } from "packages/graphql/deps.ts";

export const TimecodeInMillisecondsScalarType = scalarType({
  name: "TimecodeInMilliseconds",
  asNexusMethod: "msTime",
  description: "Timecode described as milliseconds",
  sourceType: "number",
});
