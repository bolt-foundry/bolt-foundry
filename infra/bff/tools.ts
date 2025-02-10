import type { Handler } from "packages/web/web.tsx";
import { getLogger } from "packages/logger.ts";
import { BfError } from "packages/BfError.ts";
const logger = getLogger(import.meta);

export function addTools(routes: Map<string, Handler>) {
  logger.debug("Adding tools");
  routes.set("/tools/jupyter-notebook-open", async (req) => {
    const searchParams = new URLSearchParams(new URL(req.url).search);
    const filePath = searchParams.get("filePath");
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://${
          Deno.env.get("REPLIT_DEV_DOMAIN")
        }:3000/notebooks/${filePath}?token=bfjupyter`,
      },
    });
  });
  routes.set("/tools/jupyter-console-open", async (req) => {
    const searchParams = new URLSearchParams(new URL(req.url).search);
    const filePath = searchParams.get("filePath");
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://${
          Deno.env.get("REPLIT_DEV_DOMAIN")
        }:3000/consoles/${filePath}?token=bfjupyter`,
      },
    });
  });

  routes.set("/tools/sapling-open", async () => {
    const { stdout } =
      await (new Deno.Command("sl", { args: ["web", "--json", "--no-open"] }))
        .output();
    const stdoutText = new TextDecoder().decode(stdout);
    const json = JSON.parse(stdoutText);
    const token = json.token;
    if (!token) {
      throw new BfError("Sapling token not found");
    }
    return new Response(null, {
      status: 302,
      headers: {
        location: `https://${
          Deno.env.get("REPLIT_DEV_DOMAIN")
        }:3001/?token=${token.trim()}&cwd=%2Fhome%2Frunner%2Fworkspace`,
      },
    });
  });
}
