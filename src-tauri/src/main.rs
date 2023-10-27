// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use reqwest::{header::USER_AGENT, Client};
use scraper::{Html, Selector};
use std::fs::File;
use std::io::Write;
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
        .invoke_handler(tauri::generate_handler![play, get_cover, download_img])
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
    let selector = Selector::parse(".image").expect("sleector error");
    let doc = Html::parse_fragment(&body);
    let src = doc
        .select(&selector)
        .next()
        .expect("fuck")
        .value()
        .attr("src")
        .expect("can't find src");

    Ok(src.to_string())
}

#[tauri::command]
async fn download_img(path: &str, code: &str, src: &str) -> Result<(), String> {
    let data = reqwest::get(src)
        .await
        .expect("nothing")
        .bytes()
        .await
        .expect("can't find the image");

    let img_path = path.to_string() + &code.to_string() + ".jpg";
    println!("{}", img_path);
    let mut file = File::create(img_path).expect("write image fail");
    file.write_all(&data).expect("write error");

    Ok(())
}
