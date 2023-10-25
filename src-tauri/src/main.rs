// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use reqwest::{header::USER_AGENT, Client, Proxy};
use scraper::{Html, Selector};
use serde::de::Error;
use std::process::Command;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![play, get_cover])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn play(path: &str) {
    let _result = Command::new("open").args(["-a", "iina", path]).output();
}

#[tauri::command]
async fn get_cover(code: &str) -> Result<String, String> {
    println!("{}", code);
    let client = Client::new();
    let user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36";
    let response = client
        .get("https://www.141jav.com/torrent/".to_string() + &code.replace("-", "").to_lowercase())
        .header(USER_AGENT, user_agent)
        .send()
        .await
        .or(Err("fetch error"))?;

    let body = response.text().await.or(Err("fetch error"))?;
    let doc = Html::parse_fragment(&body);
    let selector = Selector::parse(".image").expect("sleector error");
    let mut img = doc.select(&selector);
    let src = img
        .next()
        .expect("找不到封面")
        .value()
        .attr("src")
        .expect("找不到封面地址");
    println!("{:?}", src);

    Ok(src.to_string())
}
