## Bale Mini App Guide for AI Agents (Next.js + React + Baazoo Integration)

This comprehensive guide merges the Bale Mini App SDK with hardened security and UX strategies proven in Eitaa MiniApp workflows. It’s optimized for AI agents building in **Next.js + React**, including end-to-end bot messaging via **Baazoo**, session validation, and permission-aware automation.

### 1. Project Setup

```bash
npx create-next-app@latest bale-miniapp
cd bale-miniapp
npm install
```

### 2. Bale SDK Injection

**pages/\_app.js**:

```js
import "@/styles/globals.css"
import Script from "next/script"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script src="https://tapi.bale.ai/miniapp.js?3" strategy="beforeInteractive" />
      <Component {...pageProps} />
    </>
  )
}
```

### 3. Init and Event Handling

**pages/index.js**:

```jsx
import { useEffect, useState } from "react"

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const WebApp = window?.Bale?.WebApp
    if (!WebApp) return

    const { user } = WebApp.initDataUnsafe || {}
    if (user) setUser(user)

    WebApp.onEvent("backButtonPressed", () => console.log("Back pressed"))
    WebApp.onEvent("settingsButtonPressed", () => console.log("Settings pressed"))

    WebApp.ready()
  }, [])

  return (
    <main className="p-4">
      <h1>{user ? `Hi, ${user.first_name}` : "Loading..."}</h1>
      <button onClick={() => window.Bale.WebApp.sendData(JSON.stringify({ status: "complete" }))}>Send</button>
    </main>
  )
}
```

### 4. SDK Features and Methods

| Method                                      | Description                          |
| ------------------------------------------- | ------------------------------------ |
| `ready()`                                   | Notify Bale UI is ready              |
| `sendData()`                                | Send data to bot & auto-close app    |
| `expand()` / `close()`                      | UI control                           |
| `openLink()`                                | Opens external links                 |
| `initDataUnsafe`                            | Raw session/user info (validate it!) |
| `requestContact()` / `requestWriteAccess()` | Permission dialogs                   |
| `themeParams` / `colorScheme`               | Theming info                         |
| `MainButton` / `BackButton`                 | Custom buttons support               |

### 5. Auth Hash Validation (Node.js)

```js
import crypto from "crypto"

function validateInitData(data, botToken) {
  const secretKey = crypto.createHmac("sha256", botToken).update("WebAppData").digest()
  const dataCheck = Object.entries(data)
    .filter(([k]) => k !== "hash")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n")
  const hmac = crypto.createHmac("sha256", secretKey).update(dataCheck).digest("hex")
  return hmac === data.hash
}
```

Include a timestamp freshness check via `auth_date` to avoid replay attacks.

### 6. Messaging via Baazoo or Safir

#### A. MiniApp → Bot

```js
Bale.WebApp.sendData(JSON.stringify({ action: "confirm" }))
```

#### B. Backend → Bot API

```ts
await fetch(`https://tapi.bale.ai/bot${BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ chat_id: userId, text: "✅ Received!" }),
})
```

#### C. Backend → Safir

```ts
await fetch("https://safir.bale.ai/api/v3/send_message", {
  method: "POST",
  headers: {
    "api-access-key": process.env.SAFIR_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    request_id: `req_${Date.now()}`,
    bot_id: 123456,
    phone_number: "98912XXXXXXX",
    message_data: { message: { text: "Your order is confirmed." } },
  }),
})
```

### 7. Permissions and Fallbacks

- Check `initDataUnsafe.user.allows_write_to_pm`
- Use `requestWriteAccess()` if false
- Fallback: if sendMessage fails, prompt user to open bot manually and press Start

### 8. Advanced SDK Usage

| Feature        | Function                             |
| -------------- | ------------------------------------ |
| Theme sync     | `themeParams`, `colorScheme`         |
| QR Scanning    | `showScanQrPopup(callback)`          |
| Alerts         | `showAlert(msg)`, `showConfirm(...)` |
| Persistent app | `addToHomeScreen()` prompt           |
| Close behavior | `WebApp.close()`                     |

### 9. Testing & Debugging

- Enable Bale Dev Tools (long press version in About)
- Use `ngrok` for HTTPS tunnel:

```bash
npx ngrok http 3000
```

- Use `chrome://inspect` to debug MiniApp WebView

### 10. FrontFlow Integration

- Set Bale webhook to FrontFlow URL
- Handle incoming `web_app_data` updates
- Chain nodes: Trigger → JSON Parse → HTTP Request
- Send via Bot or Safir API from FrontFlow as needed

---

This version of the guide draws from [Eitaa MiniApp Integration Guide for Floy](sandbox:/mnt/data/Eitaa%20MiniApp%20Integration%20Guide%20for%20Floy.pdf) to adopt proven authentication and messaging patterns including:

- Client validation via hash + replay protection
- Contact/send permission request flows
- Rich JS SDK use (MainButton, colorScheme, etc.)
- Scalable backend design patterns (token handling, message errors)

Result: A secure, UI-consistent, and automatable MiniApp experience inside Bale.
