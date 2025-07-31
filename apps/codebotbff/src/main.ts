import { invoke } from "@tauri-apps/api/core";
import { Command } from "@tauri-apps/plugin-shell";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/lib/xterm.css";

// Terminal instance
let terminal: Terminal | null = null;
let fitAddon: FitAddon | null = null;
let currentWorkspace: string | null = null;
let containerCommand: Command | null = null;

// Initialize terminal
function initTerminal() {
  const container = document.getElementById('terminal-container');
  if (!container) return;

  terminal = new Terminal({
    theme: {
      background: '#000000',
      foreground: '#ffffff',
      cursor: '#ffffff',
      selection: '#444444'
    },
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 14,
    cursorBlink: true
  });

  fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);
  terminal.loadAddon(new WebLinksAddon());
  
  terminal.open(container);
  fitAddon.fit();

  // Handle window resize
  window.addEventListener('resize', () => {
    if (fitAddon) fitAddon.fit();
  });
}

// Update status displays
function updateStatus(workspace: string | null, status: 'running' | 'stopped') {
  const workspaceEl = document.getElementById('workspace-name');
  const statusEl = document.getElementById('container-status');
  
  if (workspaceEl) {
    workspaceEl.textContent = workspace || 'None';
  }
  
  if (statusEl) {
    statusEl.textContent = status === 'running' ? 'Running' : 'No Container';
    statusEl.className = status === 'running' ? 'status-badge running' : 'status-badge';
  }
}

// Launch new workspace
async function launchNewWorkspace() {
  try {
    terminal?.clear();
    terminal?.writeln('Creating new workspace...');
    
    // Call Rust backend to create workspace
    const workspace = await invoke<string>('create_new_workspace');
    currentWorkspace = workspace;
    
    terminal?.writeln(`Workspace created: ${workspace}`);
    terminal?.writeln('Starting container...');
    
    // Start container
    await invoke('start_container', { workspace });
    
    updateStatus(workspace, 'running');
    terminal?.writeln('Container started successfully!');
    
    // Connect terminal to container
    await connectToContainer(workspace);
    
    // Load file tree
    await refreshFileTree(workspace);
  } catch (error) {
    terminal?.writeln(`Error: ${error}`);
    console.error('Failed to launch workspace:', error);
  }
}

// Resume existing workspace
async function resumeWorkspace() {
  try {
    // Get list of workspaces from backend
    const workspaces = await invoke<Array<{name: string, running: boolean}>>('list_workspaces');
    
    if (workspaces.length === 0) {
      terminal?.writeln('No workspaces found. Create a new one!');
      return;
    }
    
    // For now, just use the first workspace
    // TODO: Show a selection dialog
    const workspace = workspaces[0];
    currentWorkspace = workspace.name;
    
    terminal?.clear();
    terminal?.writeln(`Resuming workspace: ${workspace.name}`);
    
    if (!workspace.running) {
      terminal?.writeln('Starting container...');
      await invoke('start_container', { workspace: workspace.name });
    }
    
    updateStatus(workspace.name, 'running');
    await connectToContainer(workspace.name);
    await refreshFileTree(workspace.name);
  } catch (error) {
    terminal?.writeln(`Error: ${error}`);
    console.error('Failed to resume workspace:', error);
  }
}

// Connect terminal to container
async function connectToContainer(workspace: string) {
  try {
    // This would establish a PTY connection to the container
    // For now, we'll simulate it
    terminal?.writeln('Connected to container.');
    terminal?.writeln('');
    terminal?.write('codebot@' + workspace + ':~$ ');
  } catch (error) {
    console.error('Failed to connect to container:', error);
  }
}

// Refresh file tree
async function refreshFileTree(workspace: string) {
  try {
    const files = await invoke<Array<{name: string, isDirectory: boolean}>>('list_workspace_files', { workspace });
    
    const fileTreeEl = document.getElementById('file-tree');
    if (!fileTreeEl) return;
    
    fileTreeEl.innerHTML = '';
    
    files.forEach(file => {
      const fileEl = document.createElement('div');
      fileEl.className = `file-item ${file.isDirectory ? 'directory' : 'file'}`;
      fileEl.textContent = file.name;
      fileTreeEl.appendChild(fileEl);
    });
  } catch (error) {
    console.error('Failed to refresh file tree:', error);
  }
}

// Clear terminal
function clearTerminal() {
  terminal?.clear();
}

// Restart container
async function restartContainer() {
  if (!currentWorkspace) {
    terminal?.writeln('No workspace selected');
    return;
  }
  
  try {
    terminal?.writeln('Restarting container...');
    await invoke('restart_container', { workspace: currentWorkspace });
    terminal?.writeln('Container restarted');
    await connectToContainer(currentWorkspace);
  } catch (error) {
    terminal?.writeln(`Error: ${error}`);
  }
}

// Initialize app
window.addEventListener("DOMContentLoaded", () => {
  initTerminal();
  
  // Set up button handlers
  document.getElementById('new-workspace-btn')?.addEventListener('click', launchNewWorkspace);
  document.getElementById('resume-workspace-btn')?.addEventListener('click', resumeWorkspace);
  document.getElementById('clear-terminal')?.addEventListener('click', clearTerminal);
  document.getElementById('restart-container')?.addEventListener('click', restartContainer);
  document.getElementById('refresh-files')?.addEventListener('click', () => {
    if (currentWorkspace) refreshFileTree(currentWorkspace);
  });
  
  // Initial status
  updateStatus(null, 'stopped');
  terminal?.writeln('Welcome to Codebot BFF!');
  terminal?.writeln('Click "New Workspace" to start or "Resume Workspace" to continue.');
});