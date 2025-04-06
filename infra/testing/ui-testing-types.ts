// Type declarations for UI testing state
declare global {
  interface Window {
    __ui_testing_state: Map<string, boolean>;
  }

  var __ui_testing_state: Map<string, boolean>;

  // Add any UI testing callback function types
  interface UITestingCallbacks {
    [key: string]: () => void;
  }

  var __ui_testing_callbacks: UITestingCallbacks;
}

export {};
