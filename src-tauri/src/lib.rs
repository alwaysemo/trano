use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager, WebviewUrl, WebviewWindowBuilder,
};
use tauri_plugin_autostart::MacosLauncher;

mod config;

fn localized_menu_label(language: &str, key: &str) -> &'static str {
    match (language, key) {
        ("zh-CN", "input") => "输入翻译",
        ("zh-CN", "screenshot") => "截图翻译",
        ("zh-CN", "selection") => "划词翻译",
        ("zh-CN", "settings") => "设置",
        ("zh-CN", "quit") => "退出",
        ("zh-TW", "input") => "文字翻譯",
        ("zh-TW", "screenshot") => "截圖翻譯",
        ("zh-TW", "selection") => "劃詞翻譯",
        ("zh-TW", "settings") => "設定",
        ("zh-TW", "quit") => "退出",
        ("ja", "input") => "テキスト翻訳",
        ("ja", "screenshot") => "スクリーンショット翻訳",
        ("ja", "selection") => "選択範囲翻訳",
        ("ja", "settings") => "設定",
        ("ja", "quit") => "終了",
        ("ko", "input") => "텍스트 번역",
        ("ko", "screenshot") => "스크린샷 번역",
        ("ko", "selection") => "선택 영역 번역",
        ("ko", "settings") => "설정",
        ("ko", "quit") => "종료",
        ("fr", "input") => "Traduction de texte",
        ("fr", "screenshot") => "Traduction de capture",
        ("fr", "selection") => "Traduction de sélection",
        ("fr", "settings") => "Paramètres",
        ("fr", "quit") => "Quitter",
        ("es", "input") => "Traducción de texto",
        ("es", "screenshot") => "Traducción de captura",
        ("es", "selection") => "Traducción de selección",
        ("es", "settings") => "Configuración",
        ("es", "quit") => "Salir",
        ("de", "input") => "Textübersetzung",
        ("de", "screenshot") => "Screenshot-Übersetzung",
        ("de", "selection") => "Auswahlübersetzung",
        ("de", "settings") => "Einstellungen",
        ("de", "quit") => "Beenden",
        ("pt", "input") => "Tradução de texto",
        ("pt", "screenshot") => "Tradução de captura",
        ("pt", "selection") => "Tradução de seleção",
        ("pt", "settings") => "Configurações",
        ("pt", "quit") => "Sair",
        _ => match key {
            "input" => "Text translation",
            "screenshot" => "Screenshot translation",
            "selection" => "Selection translation",
            "settings" => "Settings",
            "quit" => "Quit",
            _ => "Unknown",
        },
    }
}

struct TrayMenuItems {
    input: MenuItem<tauri::Wry>,
    screenshot: MenuItem<tauri::Wry>,
    selection: MenuItem<tauri::Wry>,
    settings: MenuItem<tauri::Wry>,
    quit: MenuItem<tauri::Wry>,
}

pub(crate) fn build_tray_menu(
    app: &tauri::AppHandle,
    language: &str,
) -> tauri::Result<(Menu<tauri::Wry>, TrayMenuItems)> {
    let input = MenuItem::with_id(
        app,
        "input",
        localized_menu_label(language, "input"),
        true,
        None::<&str>,
    )?;
    let screenshot = MenuItem::with_id(
        app,
        "screenshot",
        localized_menu_label(language, "screenshot"),
        true,
        None::<&str>,
    )?;
    let selection = MenuItem::with_id(
        app,
        "selection",
        localized_menu_label(language, "selection"),
        true,
        None::<&str>,
    )?;
    let settings = MenuItem::with_id(
        app,
        "settings",
        localized_menu_label(language, "settings"),
        true,
        None::<&str>,
    )?;
    let quit = MenuItem::with_id(
        app,
        "quit",
        localized_menu_label(language, "quit"),
        true,
        None::<&str>,
    )?;

    let menu = Menu::with_items(app, &[&input, &screenshot, &selection, &settings, &quit])?;
    let items = TrayMenuItems {
        input,
        screenshot,
        selection,
        settings,
        quit,
    };

    Ok((menu, items))
}

pub(crate) fn refresh_tray_menu(app: &tauri::AppHandle, language: &str) -> tauri::Result<()> {
    let Some(items) = app.try_state::<TrayMenuItems>() else {
        return Ok(());
    };

    items
        .input
        .set_text(localized_menu_label(language, "input"))?;
    items
        .screenshot
        .set_text(localized_menu_label(language, "screenshot"))?;
    items
        .selection
        .set_text(localized_menu_label(language, "selection"))?;
    items
        .settings
        .set_text(localized_menu_label(language, "settings"))?;
    items
        .quit
        .set_text(localized_menu_label(language, "quit"))?;
    Ok(())
}

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
        .invoke_handler(tauri::generate_handler![
            config::load_preferences,
            config::save_preferences,
            config::set_icon_visibility
        ])
        // Tauri 插件
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let preferences = config::load_preferences(app.handle().clone())?;
            config::apply_icon_visibility(app.handle(), preferences.show_in_dock)?;

            let (menu, items) = build_tray_menu(app.handle(), preferences.language.as_str())?;
            app.manage(items);
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
