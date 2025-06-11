# bff-eval

Node.js wrapper for the Bolt Foundry evaluation framework. This package provides a convenient `bff-eval` command that forwards all arguments to `bff eval`.

## Installation

```bash
npm install -g bff-eval
```

## Usage

All arguments are forwarded directly to `bff eval`:

```bash
bff-eval --input test.jsonl --grader grader.js
```

This is equivalent to running:

```bash
bff eval --input test.jsonl --grader grader.js
```

## Documentation

For full documentation on the Bolt Foundry evaluation framework, including:
- How to write graders
- Input/output formats
- Available options
- Examples and demos

Please see the main Bolt Foundry documentation or run:

```bash
bff eval --help
```

## Requirements

- Node.js >= 22.0.0
- The `bff` command must be available in your PATH

## License

MIT