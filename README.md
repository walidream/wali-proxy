# Wali Proxy

A lightweight Chrome extension for intercepting HTTP requests and returning custom response data. Built for local debugging.

## Features

- Intercept `fetch` and `XMLHttpRequest` requests
- Full URL matching (including query parameters)
- Edit response body (JSON) directly in the popup
- Per-rule enable/disable toggle
- Global on/off switch
- Real-time JSON validation
- One-click refresh current tab

## Install

1. Download or clone this repo
2. Run `bash build.sh`
3. Open `chrome://extensions/`
4. Enable **Developer Mode**
5. Click **Load unpacked** and select the `dist` folder

## Usage

1. Click the extension icon to open the popup
2. Click **+ Add Rule**
3. Enter the full URL to intercept (e.g. `https://api.example.com/data?page=1`)
4. Enter the JSON response body
5. Click **Refresh** to reload the current tab

Intercepted requests will be logged in the browser console:

```
[Fetch Interceptor] Intercepted: https://api.example.com/data?page=1
```

## How It Works

- **interceptor.js** — Injected into the page (MAIN world) at `document_start`, overrides `window.fetch` and `XMLHttpRequest`
- **bridge.js** — Runs in ISOLATED world, bridges `chrome.storage` to the page via `postMessage`
- **popup.html/js** — UI for managing interception rules

## License

MIT
