export default class PerfLogger {
  public constructedAt = performance.now();
  public lastPerfRecordedAt = performance.now();
  public perfLog: Array<{
    tag: string;
    time: number;
    timeSinceConstructed: number;
    timeSinceLast: number;
  }> = [];

  constructor(public relativeDuration = Infinity) {}
  log(tag: string) {
    const start = performance.now();
    return () => {
      const end = performance.now();
      this.recordPerf(tag, end - start);
    };
  }

  private recordPerf(tag: string, time: number) {
    const now = performance.now();
    const constructedAt = this.constructedAt;
    const timeSinceConstructed = now - constructedAt;
    const timeSinceLast = now - this.lastPerfRecordedAt;
    this.lastPerfRecordedAt = now;
    this.perfLog.push({
      tag,
      time,
      timeSinceConstructed,
      timeSinceLast,
    });
  }

  report() {
    // loop over the perf log and include p50, p99 for each tag.
    const reducedLog = this.perfLog.reduce((acc, log) => {
      if (!acc[log.tag]) {
        acc[log.tag] = [];
      }
      acc[log.tag].push(log.time);
      return acc;
    }, {} as Record<string, Array<number>>);

    const p1 = (arr: Array<number>) => {
      const sorted = arr.sort((a, b) => a - b);
      const index = Math.floor(sorted.length * 0.01);
      return sorted[index];
    };

    const p10 = (arr: Array<number>) => {
      const sorted = arr.sort((a, b) => a - b);
      const index = Math.floor(sorted.length * 0.1);
      return sorted[index];
    };

    const p50 = (arr: Array<number>) => {
      const sorted = arr.sort((a, b) => a - b);
      const index = Math.floor(sorted.length * 0.5);
      return sorted[index];
    };

    const p99 = (arr: Array<number>) => {
      const sorted = arr.sort((a, b) => a - b);
      const index = Math.floor(sorted.length * 0.99);
      return sorted[index];
    };

    const total = (arr: Array<number>) => {
      return arr.reduce((acc, n) => acc + n, 0);
    };

    const output: {
      [key: string]: {
        p1: number;
        p10: number;
        p50: number;
        p99: number;
        total: number;
        percentage?: number;
        multiple?: number;
      };
    } = {};

    // Iterate through the reduced log, compute statistics, and append to CSV output
    for (const tag in reducedLog) {
      output[tag] = {
        p1: p1(reducedLog[tag]),
        p10: p10(reducedLog[tag]),
        p50: p50(reducedLog[tag]),
        p99: p99(reducedLog[tag]),
        total: total(reducedLog[tag]),
      };
    }

    const now = performance.now();
    const totalDuration = now - this.constructedAt;

    // iterate through and get a percentage of the total for each element
    for (const tag in output) {
      const percentage = output[tag].total / totalDuration;
      output[tag].percentage = percentage;
      output[tag].multiple = output[tag].total / this.relativeDuration;
    }

    return output;
  }
}
