import { posthog } from "posthog-js";

export function ensurePostHogSetup() {
  const posthogId = Deno.env.get("BF_POSTHOG_ID") ?? "";
  posthog.init(posthogId, {
    api_host: "https://us.i.posthog.com",
    autocapture: {
      dom_event_allowlist: ["click", "change", "submit"], // Placeholder for now
    },
  });
  console.log("PostHog initialized with ID:", posthogId);

  // Spawn a demo event for testing purposes.
  // We have to figure out how to get it to automatically track events.
  // The docs allege that this happens automatically, but for the time being,
  // our options are: get to the bottom of why only this manual trigger works
  // or get to the bottom of marking and setting events in each component
  // (also didn't get that working just yet). So we have options.
  // Functionally, it is on, it works, it runs, it is a thing.
  posthog.capture({
    distinctId: "distinct_id_of_the_user",
    event: "user signed up",
  });

  // Optionally, you could add more custom event capturing here...
}

// Alternatively, if you prefer to use the Node.js library,
// import { PostHog } from "posthog-node";

// export function ensurePostHogSetupNode() {
//   const posthogId = Deno.env.get("BF_POSTHOG_ID") ?? "";
//   const client = new PostHog(posthogId, { host: "https://us.i.posthog.com" });

//   client.capture({
//     distinctId: "distinct_id_of_the_user",
//     event: "user signed up",
//   });
// }
