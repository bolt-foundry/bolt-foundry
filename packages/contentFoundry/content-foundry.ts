export function cfAdmin() {
}
function cleanupSocket(SOCKET_PATH: string) {
  try {
    console.log(`Cleaning up socket file at ${SOCKET_PATH}`);
    return Deno.remove(SOCKET_PATH);
  } catch (error) {
    // Handle the case where the socket file doesn't exist
    if (!(error instanceof Deno.errors.NotFound)) {
      console.error(
        `Error cleaning up socket file: ${(error as Error).message}`,
      );
    }
  }
}

if (import.meta.main) {
  if (Deno.args.includes("--socket")) {
    const SOCKET_PATH = import.meta.resolve("./socket.cfsock").replace(
      "file://",
      "",
    );
    await cleanupSocket(SOCKET_PATH);

    // Listen for shutdown signals
    const signals: Array<Deno.Signal> = ["SIGINT", "SIGTERM", "SIGQUIT"];
    for (const signal of signals) {
      Deno.addSignalListener(signal, () => {
        console.log(`Received ${signal}, shutting down server...`);
        cleanupSocket(SOCKET_PATH);
        Deno.exit(0);
      });
    }

    // Set up unhandled rejection handler to cleanup on crashes
    addEventListener("unhandledrejection", (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      cleanupSocket(SOCKET_PATH);
    });

    // Start the server
    console.log(`Starting socket server at ${SOCKET_PATH}`);
    Deno.serve(
      {
        path: SOCKET_PATH,
        transport: "unix",
        onListen: () =>
          console.log(`Socket server listening at ${SOCKET_PATH}`),
      },
      handler,
    );
  } else {
    //   Deno.serve(handler);
  }
}
