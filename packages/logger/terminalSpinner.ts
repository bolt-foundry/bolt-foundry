// backend only, idk how to represent that yet? #BOOTCAMPTASK l1
const moonFrames = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑"];

function spinner(
  isATTY: boolean,
  messages?: string | Array<string>,
  frames = moonFrames,
) {
  let frameIndex = 0;
  let messageIndex = 0;
  let messageChangeCounter = 0;
  const frameDuration = 80;
  const messageChangeDuration = 25; // Change message every ~2 seconds (25 * 80ms)

  // Normalize messages to array
  const messageArray = messages
    ? Array.isArray(messages) ? messages : [messages]
    : [];

  return setInterval(async () => {
    const frame = frames[frameIndex++ % frames.length];
    const duration = (frameIndex * frameDuration) / 1000;
    const formattedDuration = duration.toFixed(1);

    // Get current message
    let currentMessage = "";
    if (messageArray.length > 0) {
      currentMessage = messageArray[messageIndex % messageArray.length];

      // Change message at intervals if multiple messages
      if (messageArray.length > 1) {
        messageChangeCounter++;
        if (messageChangeCounter >= messageChangeDuration) {
          messageChangeCounter = 0;
          messageIndex++;
        }
      }
    }

    if (isATTY) {
      try {
        const output = currentMessage
          ? `\r${frame} ${currentMessage} (${formattedDuration}s)`
          : `\r${frame} Elapsed: ${formattedDuration}s - `;

        // Clear the line first to handle varying message lengths
        await Deno.stdout.write(
          new TextEncoder().encode("\r\x1b[K" + output),
        );
      } catch (_) {
        // ignore
      }
    }
  }, frameDuration);
}

export default function startSpinner(
  messages?: string | Array<string>,
): () => void {
  const isATTY = Deno.stdout.isTerminal();
  const spinnerInterval = spinner(isATTY, messages);
  return () => {
    clearInterval(spinnerInterval);
    if (isATTY) {
      // Clear the spinner line when stopping
      try {
        Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K"));
      } catch (_) {
        // ignore
      }
    }
  };
}
