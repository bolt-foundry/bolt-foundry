# Codebot BFF

A Tauri-based desktop GUI for managing bft codebot containers.

## Features

- **Terminal Emulator**: Built-in terminal for interacting with codebot
  containers
- **File Viewer**: Browse workspace files in a tree view
- **Container Management**: Start, stop, and restart containers with a click
- **Workspace Management**: Create new workspaces or resume existing ones
- **Resource Monitoring**: View container memory and CPU usage

## Development

### Prerequisites

The project uses Nix for dependency management. All required dependencies (Rust,
Deno, etc.) are provided through the Nix development environment.

- Nix package manager
- Docker/Container runtime
- Platform-specific dependencies are handled by Nix

To enter the development environment:

```bash
nix develop
```

### Setup

```bash
cd apps/codebotbff
# No installation needed - Deno will fetch dependencies on first run
```

### Run in Development

```bash
deno task tauri dev
```

### Build for Production

```bash
deno task tauri build
```

The built application will be in `src-tauri/target/release/bundle/`.

## Architecture

- **Frontend**: TypeScript + xterm.js for terminal emulation
- **Backend**: Rust with Tauri for system integration
- **Container Management**: Interfaces with Docker/container runtime via shell
  commands

## TODO

- [ ] Implement real PTY connection to containers
- [ ] Add file editor functionality
- [ ] Implement workspace selection dialog
- [ ] Add resource usage monitoring
- [ ] Support for multiple terminal tabs
- [ ] File tree context menu (open, delete, rename)
- [ ] Container logs viewer
- [ ] Settings/preferences panel
