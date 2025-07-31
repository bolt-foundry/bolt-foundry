use serde::{Deserialize, Serialize};
use std::process::Command;
use std::fs;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct WorkspaceInfo {
    name: String,
    running: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct FileInfo {
    name: String,
    #[serde(rename = "isDirectory")]
    is_directory: bool,
}

// Generate random workspace name
fn generate_workspace_name() -> String {
    let names = vec![
        "fuzzy-kitten", "happy-dolphin", "brave-eagle", "swift-fox",
        "clever-owl", "gentle-panda", "mighty-lion", "wise-turtle"
    ];
    let timestamp = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_secs();
    
    let random_index = (timestamp as usize) % names.len();
    format!("{}-{}", names[random_index], timestamp % 1000)
}

#[tauri::command]
async fn create_new_workspace() -> Result<String, String> {
    let workspace_name = generate_workspace_name();
    let workspace_path = format!("/tmp/codebot-workspaces/{}", workspace_name);
    
    // Create workspace directory
    fs::create_dir_all(&workspace_path)
        .map_err(|e| format!("Failed to create workspace directory: {}", e))?;
    
    Ok(workspace_name)
}

#[tauri::command]
async fn list_workspaces() -> Result<Vec<WorkspaceInfo>, String> {
    let workspaces_dir = "/tmp/codebot-workspaces";
    let mut workspaces = Vec::new();
    
    // Create dir if it doesn't exist
    let _ = fs::create_dir_all(workspaces_dir);
    
    // Get running containers
    let output = Command::new("docker")
        .args(&["ps", "--format", "{{.Names}}"])
        .output()
        .unwrap_or_else(|_| Command::new("echo").output().unwrap());
    
    let running_containers: Vec<String> = String::from_utf8_lossy(&output.stdout)
        .lines()
        .map(String::from)
        .collect();
    
    // List workspace directories
    if let Ok(entries) = fs::read_dir(workspaces_dir) {
        for entry in entries.flatten() {
            if entry.file_type().map(|ft| ft.is_dir()).unwrap_or(false) {
                if let Some(name) = entry.file_name().to_str() {
                    workspaces.push(WorkspaceInfo {
                        name: name.to_string(),
                        running: running_containers.contains(&name.to_string()),
                    });
                }
            }
        }
    }
    
    Ok(workspaces)
}

#[tauri::command]
async fn start_container(workspace: String) -> Result<(), String> {
    // For now, just return success
    println!("Would start container for workspace: {}", workspace);
    Ok(())
}

#[tauri::command]
async fn restart_container(workspace: String) -> Result<(), String> {
    println!("Would restart container for workspace: {}", workspace);
    Ok(())
}

#[tauri::command]
async fn list_workspace_files(workspace: String) -> Result<Vec<FileInfo>, String> {
    let workspace_path = format!("/tmp/codebot-workspaces/{}", workspace);
    let mut files = Vec::new();
    
    if let Ok(entries) = fs::read_dir(&workspace_path) {
        for entry in entries.flatten() {
            if let Some(name) = entry.file_name().to_str() {
                files.push(FileInfo {
                    name: name.to_string(),
                    is_directory: entry.file_type().map(|ft| ft.is_dir()).unwrap_or(false),
                });
            }
        }
    }
    
    // Sort directories first, then files
    files.sort_by(|a, b| {
        match (a.is_directory, b.is_directory) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.name.cmp(&b.name),
        }
    });
    
    Ok(files)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            create_new_workspace,
            list_workspaces,
            start_container,
            restart_container,
            list_workspace_files
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}