use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_autostart::MacosLauncher;

mod config;

/// 拦截窗口关闭事件：不销毁窗口，而是隐藏，
/// 这样托盘菜单才能随时把同一个窗口重新唤出
fn apply_close_to_hide(app: &tauri::AppHandle, label: &str) {
    let Some(window) = app.get_webview_window(label) else {
        return;
    };
    // 先 clone 一份再 move 进闭包，避免 window 同时被借用和移动
    let win = window.clone();
    window.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            api.prevent_close();
            let _ = win.hide();
        }
    });
}

/// 显示指定窗口；若窗口不存在则按默认配置重新创建
fn show_window(app: &tauri::AppHandle, label: &str) -> tauri::Result<()> {
    let window = match app.get_webview_window(label) {
        Some(window) => window,
        None => {
            let url = format!("{label}.html");
            let window = WebviewWindowBuilder::new(app, label, WebviewUrl::App(url.into()))
                .title(label)
                .inner_size(380.0, 600.0)
                .visible(false)
                .decorations(false)
                .build()?;
            apply_close_to_hide(app, label);
            window
        }
    };
    window.unminimize()?;
    window.show()?;
    window.set_focus()?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![config::load_preferences, config::save_preferences])
        // Tauri 插件
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            // ==========================
            // 创建托盘菜单
            // ==========================
            let input = MenuItem::with_id(app, "input", "输入翻译", true, None::<&str>)?;
            let screenshot = MenuItem::with_id(app, "screenshot", "截图翻译", true, None::<&str>)?;
            let selection = MenuItem::with_id(app, "selection", "划词翻译", true, None::<&str>)?;
            let settings = MenuItem::with_id(app, "settings", "设置", true, None::<&str>)?;
            let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&input, &screenshot, &selection, &settings, &quit])?;
            // ==========================
            // 创建系统托盘
            // ==========================
            TrayIconBuilder::new()
                .menu(&menu)
                .show_menu_on_left_click(false)
                .icon(
                    app.default_window_icon()
                        .expect("default window icon not found")
                        .clone(),
                )
                .tooltip("trano")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "input" => {
                        if let Err(error) = show_window(app, "input") {
                            eprintln!("打开输入翻译窗口失败: {error}");
                        }
                    }
                    "screenshot" => {
                        if let Err(error) = show_window(app, "screenshot") {
                            eprintln!("打开截图翻译窗口失败: {error}");
                        }
                    }
                    "selection" => {
                        if let Err(error) = show_window(app, "selection") {
                            eprintln!("打开划词翻译窗口失败: {error}");
                        }
                    }
                    "settings" => {
                        if let Err(error) = show_window(app, "settings") {
                            eprintln!("打开设置窗口失败: {error}");
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .build(app)?;
            // ==========================
            // 所有窗口：点 × 时隐藏而不是销毁
            // ==========================
            for label in ["input", "screenshot", "selection", "settings"] {
                apply_close_to_hide(app.handle(), label);
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
