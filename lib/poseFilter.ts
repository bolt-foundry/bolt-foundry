// #BOOTCAMPTASK move this to packages/client/lib because the frontend needs it or something.

export default class PoseFilter {
  private initialized: boolean;
  private Q: number; // Process noise covariance
  private R: number; // Measurement noise covariance
  private P: number; // Estimate error covariance
  private K: number; // Kalman Gain
  private x: number; // Value being tracked
  private movementThresholdPct: number; // The minimum change required to update the position as a percentage of the canvas width
  private largeMovementThresholdPct: number; // With large movement, it may be a camera cut, so we reset the filter
  private lastSignificantX: number;
  private accumulatedMovement: number; // Accumulates movement in the same direction
  private movementThreshold: number; // The minimum change required to update the position
  private largeMovementThreshold: number; // With large movement, it may be a camera cut, so we reset the filter
  private targetX: number; // The target x position after crossing the threshold
  private easingFactor: number; // A value between 0 and 1 determining the speed of interpolation
  private ratio: number; // The aspect ratio of the video
  private width: number; // The width of the canvas
  private srcWidth: number; // The width of the source video

  constructor(
    processNoise: number,
    measurementNoise: number,
    errorCovariance: number,
    movementThresholdPct: number,
    largeMovementThresholdPct: number,
    ratio: number = 16 / 9,
    width: number = 1080,
    easingFactor: number = 0.05,
  ) {
    this.initialized = false;
    this.Q = processNoise;
    this.R = measurementNoise;
    this.P = errorCovariance;
    this.K = 0; // Initial Kalman Gain
    this.x = 0; // Initial guess at the state value
    this.movementThresholdPct = movementThresholdPct;
    this.largeMovementThresholdPct = largeMovementThresholdPct;
    this.easingFactor = easingFactor;
    this.lastSignificantX = 0;
    this.accumulatedMovement = 0;
    this.movementThreshold = 0;
    this.largeMovementThreshold = 0;
    this.targetX = 0;
    this.ratio = ratio;
    this.width = width;
    this.srcWidth = 0;
  }

  public updateWidth(width: number): void {
    this.movementThreshold = this.movementThresholdPct * width;
    this.largeMovementThreshold = this.largeMovementThresholdPct * width;
    this.srcWidth = width;
  }

  public update(updatedMeasurement: number | null): number {
    let measurement = updatedMeasurement;

    // if there is no data for this frame, use the last measurement
    if (measurement === null) {
      measurement = this.lastSignificantX;
    }
    const priorX = this.x;
    if (!this.initialized) {
      this.reset(measurement);
      this.initialized = true;
      return measurement;
    }

    // Check if the change is larger than the large movement threshold (e.g., camera switch)
    const largeMovementDetected =
      Math.abs(measurement - this.x) > this.largeMovementThreshold;

    if (largeMovementDetected) {
      this.reset(measurement);
      return measurement;
    } else {
      // Kalman filter algorithm
      // Prediction update
      this.P += this.Q;

      // Measurement update
      this.K = this.P / (this.P + this.R); // Kalman gain
      this.x += this.K * (measurement - this.x); // Updated estimate
      this.P *= 1 - this.K; // Updated error covariance

      // uncomment to only run Kalman filter
      // return this.x;

      // Calculate the difference from the new measurement to the prior estimate
      const measurementDifference = measurement - priorX;
      this.accumulatedMovement += measurementDifference;
      // If the accumulated movement is in the opposite direction, reset it
      if (
        Math.sign(this.accumulatedMovement) !== Math.sign(measurementDifference)
      ) {
        // this.accumulatedMovement = measurementDifference;
        this.accumulatedMovement *= 0.5; // Reduce the accumulated movement by half to avoid a hard reset
      }

      // Check if the accumulated movement exceeds the movement threshold
      const movementThresholdExceeded =
        Math.abs(this.accumulatedMovement) > this.movementThreshold;
      if (movementThresholdExceeded) {
        // Update the targetX with the new measurement, since we have significant movement
        this.targetX = this.x;
        // Reset the accumulated movement since we've just made a significant move
        // this.accumulatedMovement = 0;
        this.accumulatedMovement *= 0.5; // Instead of resetting, reduce the accumulated movement
      }

      // Calculate the proportional distance to catch up
      const distanceToTarget = this.targetX - this.lastSignificantX;
      // scale the dampening
      const scaleFactor = 2;
      // Apply damping for larger movements
      // Dynamic damping factor based on the distance to the target
      const dynamicDamping = Math.min(
        Math.abs(distanceToTarget) / (this.movementThreshold) * scaleFactor,
        1,
      );

      // Apply easing and damping to move lastSignificantX towards the targetX
      this.lastSignificantX += distanceToTarget * this.easingFactor *
        dynamicDamping;
    }

    // After all calculations, clamp the lastSignificantX to ensure it doesn't go off-screen
    const limit = (this.ratio < 1 ? this.width * this.ratio : this.width) / 2;
    this.lastSignificantX = Math.max(
      limit,
      Math.min(this.lastSignificantX, this.srcWidth - limit),
    );

    return this.lastSignificantX;
  }

  private reset(measurement: number): void {
    this.x = measurement; // Initialize the state as the first measurement
    this.P = 1e4; // Start with a large estimate error covariance to indicate high uncertainty.
    this.lastSignificantX = measurement;
    this.targetX = measurement;
  }
}
