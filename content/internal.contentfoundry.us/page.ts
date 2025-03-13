#! /usr/bin/env -S deno run --allow-read=. --allow-write=socket.cfsock
import { contentFoundry } from "content-foundry";

Deno.serve(contentFoundry)