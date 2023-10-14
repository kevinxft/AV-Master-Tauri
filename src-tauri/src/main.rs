// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::process::Command;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, play])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn play(path: &str) -> Result<(), ()> {
    let output = Command::new("open").args(["-a", "iina", path]).output();

    Ok(())
}
