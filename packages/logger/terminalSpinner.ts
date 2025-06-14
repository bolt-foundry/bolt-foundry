// backend only, idk how to represent that yet? #BOOTCAMPTASK l1
const moonFrames = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌑"];
function spinner(isATTY: boolean, frames = moonFrames) {
  let i = 0;
  const frameDuration = 80;
  return setInterval(async () => {
    const frame = frames[i++ % frames.length];
    const duration = (i * frameDuration) / 1000;
    const formattedDuration = duration.toFixed(1);
    if (isATTY) {
      try {
        await Deno.stdout.write(
          new TextEncoder().encode(
            `\r${frame} Elapsed: ${formattedDuration}s - `,
          ),
        );
      } catch (_) {
        // ignore
      }
    }
  }, frameDuration);
}

export default function startSpinner(): () => void {
  const isATTY = Deno.stdout.isTerminal();
  const spinnerInterval = spinner(isATTY);
  return () => {
    clearInterval(spinnerInterval);
  };
}
