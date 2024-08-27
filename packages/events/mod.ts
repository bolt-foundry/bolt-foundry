import { posthog } from "posthog-js";

export function ensurePostHogSetup() {
  posthog.init(Deno.env.get("BF_POSTHOG_ID") ?? "", {
    api_host: "https://us.i.posthog.com",
    autocapture: {
        dom_event_allowlist: ['click', 'change', 'submit'], //placeholder for now
    },
  });
  console.log("PostHog initialized with ID:", Deno.env.get("BF_POSTHOG_ID"));
  //spawn a demo event for testing purposes. we have to figure out what how to get it to automatically track events- this is a placeholder for now.
  //the docs allege that this happens automatically, but for the time being our options are: get to the bottom of why only this manual trigger works
  //or get to the bottom of marking and setting events in each component (also didn't get that working just yet.) so we have options. functionally, it is on, it works, it runs, it is a thing.
    client.capture({
        distinctId: 'distinct_id_of_the_user',
        event: 'user signed up',
    })
  
}
// Optionally, you could add more custom event capturing here...

// However, we want to be able to capture events from the frontend and the configs give us two paths. We can do it in JS ^ 

//or we can load it via node...thoughts?


// import { PostHog } from "posthog-node";
// export function ensurePostHogSetup() {
//   const client = new PostHog(
//     Deno.env.get("BF_POSTHOG_ID") ?? "",
//     { host: "https://us.i.posthog.com" }
//   );
//   client.capture({
//       distinctId: 'distinct_id_of_the_user',
//       event: 'user signed up',
//   })
// }
