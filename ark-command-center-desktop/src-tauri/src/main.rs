#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[tauri::command]
fn open_external(url: String) -> Result<(), String> {
    let allowed = [
        "https://wikily.gg/ark-survival-ascended/maps/",
        "https://ark.wiki.gg/wiki/Resource_Map/",
    ];
    if !allowed.iter().any(|prefix| url.starts_with(prefix)) || url.chars().any(|c| c == '\n' || c == '\r' || c == '"') {
        return Err("Resource map URL not allowed".into());
    }
    #[cfg(target_os = "windows")]
    { std::process::Command::new("explorer.exe").arg(&url).spawn().map_err(|e| e.to_string())?; }
    #[cfg(not(target_os = "windows"))]
    { return Err("External map opener is available in the Windows build only".into()); }
    #[allow(unreachable_code)]
    Ok(())
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![open_external])
        .run(tauri::generate_context!())
        .expect("error while running ARK Command Center");
}
