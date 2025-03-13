const logger = console;
type ContentFoundryInitOptions = Record<string, never>;

// Define a type that represents a string ending with .cfsock

type CFSockString = `${string}.cfsock`;

// Updated function signature to use the new type
function prepSocket(socketPath: CFSockString) {
  Deno.addSignalListener("SIGINT", cleanup); // Listen for the SIGINT signal
  Deno.addSignalListener("SIGTERM", cleanup); // Listen for the SIGTERM signal

  function cleanup() {
    try {
      Deno.removeSync(socketPath); // Attempt to remove the socket file
      logger.info(`Cleaned up socket: ${socketPath}`);
    } catch (err) {
      logger.error(`Failed to clean up socket: ${socketPath}`, err);
    } finally {
      Deno.exit(); // Ensure the program exits
    }
  }
  return socketPath;
}

export function contentFoundry(
  _options: ContentFoundryInitOptions = {},
): [Deno.ServeUnixOptions, Deno.ServeHandler] {
  const path = prepSocket("contentFoundry.cfsock");

  logger.info(`Listening on ${path}`);

  return [
    {
      path,
      transport: "unix",
    },
    function contentFoundryHandler(
      _req: Request,
    ): Response | Promise<Response> {
      return new Response("Hello World");
    },
  ];
}
