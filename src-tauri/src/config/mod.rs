use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};

const SETTINGS_FILE_NAME: &str = "settings.json";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Preferences {
    pub language: String,
    pub auto_update: bool,
    pub show_in_dock: bool,
    pub position: String,
    pub font_size: u8,
    pub smart_translate: bool,
}

impl Default for Preferences {
    fn default() -> Self {
        Self {
            language: "default".to_string(),
            auto_update: true,
            show_in_dock: true,
            position: "center".to_string(),
            font_size: 16,
            smart_translate: true,
        }
    }
}

pub fn apply_icon_visibility(app: &AppHandle, show: bool) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    {
        app.set_dock_visibility(show).map_err(|error| error.to_string())?;
    }

    #[cfg(not(target_os = "macos"))]
    {
        for window in app.webview_windows().values() {
            window
                .set_skip_taskbar(!show)
                .map_err(|error| error.to_string())?;
        }
    }

    Ok(())
}

#[tauri::command]
pub fn set_icon_visibility(app: AppHandle, show: bool) -> Result<(), String> {
    apply_icon_visibility(&app, show)
}

fn settings_path(app: &AppHandle) -> Result<std::path::PathBuf, String> {
    let config_dir = app.path().app_config_dir().map_err(|error| error.to_string())?;
    fs::create_dir_all(&config_dir).map_err(|error| error.to_string())?;
    Ok(config_dir.join(SETTINGS_FILE_NAME))
}

#[tauri::command]
pub fn load_preferences(app: AppHandle) -> Result<Preferences, String> {
    let path = settings_path(&app)?;
    if !path.exists() {
        return Ok(Preferences::default());
    }

    let content = fs::read_to_string(path).map_err(|error| error.to_string())?;
    serde_json::from_str(&content).map_err(|error| error.to_string())
}

#[tauri::command]
pub fn save_preferences(app: AppHandle, preferences: Preferences) -> Result<(), String> {
    let path = settings_path(&app)?;
    let content = serde_json::to_string_pretty(&preferences).map_err(|error| error.to_string())?;
    fs::write(path, content).map_err(|error| error.to_string())
}