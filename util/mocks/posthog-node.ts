// @ts-expect-error - @real only works in mocks
export { PostHog } from "@real/posthog-node";
// deno-lint-ignore no-console
console.log("HEY WE ARE IN THE MOCKS POSTHOG NODE FILE");
