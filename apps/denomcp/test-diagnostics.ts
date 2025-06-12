// Test file for MCP diagnostics
const message: string = 42; // Type error: number is not assignable to string
const undefinedVar = someUndefinedVariable; // Reference error

function add(a: number, b: number): string {
  return a + b; // Type error: number is not assignable to string
}

console.log("This file has intentional errors for testing");
