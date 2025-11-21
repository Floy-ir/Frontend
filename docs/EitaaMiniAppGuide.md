Eitaa MiniApp Integration Guide for Floy
=======================================

Project Overview: Floy and Eitaa MiniApp Context
------------------------------------------------

Floy is a multi-source travel search engine that aggregates flight, hotel, and train ticket data from multiple
providers, displaying the cheapest and fastest options in a clean UI. The project is composed of a Next.js
(React) frontend for the user interface and a Django backend for data fetching, validation, and API
endpoints. As part of the user experience, Floy integrates with external services like Eitaa Mini Apps for
user login and real-time notifications (e.g. booking alerts). This guide explains how to integrate Floy with the
Eitaa MiniApp platform in a README-style format, covering the authentication flow, hash validation, Eitaa JS
SDK usage, sending messages to users, and the necessary backend setup.

Eitaa MiniApp Authentication Flow (Auth via Hash)
-------------------------------------------------

When a user launches the Floy MiniApp within the Eitaa messenger, Eitaa provides initial data (called
initData) to the app, which includes the user’s information and a digital signature (hash) to verify the
data’s authenticity. The overall login flow is as follows:

1. Include the Eitaa WebApp JS SDK on the frontend: In your Next.js app’s HTML the Eitaa MiniApp SDK script. For example:

   In `<head>`, include:

   `<script src="https://developer.eitaa.com/eitaa-web-app.js"></script>`

   This script must be loaded from Eitaa’s official source (do not host it locally) to ensure you get
   updates and security patches. After including the script, a global object
   `window.Eitaa.WebApp` becomes available for interaction.

2. Obtain initData from Eitaa: Once the SDK is loaded, Eitaa provides an `initData` string and a
   parsed `initDataUnsafe` object via `window.Eitaa.WebApp`. The `initData` is a URL query-
   style string containing fields like the user’s id, name, etc., along with a `hash` parameter. The
   `initDataUnsafe` is a JavaScript object representation of the same data. Do not trust
   `initDataUnsafe` directly – it contains the user info but has not yet been verified. You should use
   the raw `initData` string for verification on your server, as described next. (Eitaa’s docs explicitly
   warn that the data should be validated on the server before use.)

3. Signal readiness and UI adjustments: As soon as your app has loaded necessary UI elements, call
   `Eitaa.WebApp.ready()` to inform the Eitaa environment that your app is ready. This will hide the
   loading spinner in the Eitaa app and display your UI. You may also use Eitaa’s JS SDK to adjust the
   interface (e.g., adapt to dark mode via `WebApp.colorScheme`, expand to full height with
   `WebApp.expand()`, etc.) and handle user interactions. For example, you can read
   `window.Eitaa.WebApp.initDataUnsafe.user` to get user details (after verification) and use UI
   APIs like `Eitaa.WebApp.MainButton` or `Eitaa.WebApp.close()` as needed to enhance UX.
   These SDK functions only work inside the Eitaa app environment (not in a regular browser).

4. Send initData to your backend for verification: Immediately upon launch (or as part of your
   front-end initialization), send the `initData` string to a backend endpoint (e.g., a Django API route)
   dedicated to authenticate the user. The backend will perform hash validation to ensure the data truly
   comes from Eitaa and hasn’t been tampered with.

By following these steps, the Floy app can securely authenticate Eitaa users and start a session without
asking for a separate login, using Eitaa as the identity provider.

Hash Validation on the Backend (Verify Eitaa initData)
------------------------------------------------------

On the Django backend, implement the verification of the `initData` signature (the `hash`) to confirm
that the user data is legitimate. This process uses HMAC-SHA256, combining your Eitaa app’s bot token and
the data, similar to Telegram’s login verification. Here’s how to do it:

- Extract and prepare data: Parse the `initData` query string (e.g., using Python’s `urllib.parse`
  or similar) into an array of `key=value` strings. Separate the `hash` value from this data and hold
  onto it (it’s the signature provided by Eitaa). For example, you'll retrieve fields such as
  `user={...}`, `auth_date=...`, etc., and a `hash=...` field. Exclude the `hash` from the list of
  data fields to be verified.

- Sort the data fields: Sort the remaining `key=value` pairs alphabetically by key. This is required for
  a consistent verification string (e.g., `"auth_date=...\nchat_id=...\nuser=..."`). After sorting, join all pairs
  into a single string separated by newline characters (`\n`).

- Compute HMAC using your bot token: First, compute an HMAC-SHA256 of your Eitaa Bot Token
  using the fixed key `"WebAppData"`. (The bot token is the secret token provided by Eitaa when
  you registered your MiniApp, e.g. `5768337691:AA...5AU` in the docs’ example.) This step
  produces an intermediate key specific to your app.

- Compute the final HMAC of the data: Using the HMAC result from the previous step as the key,
  compute a second HMAC-SHA256 over the newline-joined string from the sorted data. Then take
  this result as a hexadecimal string.

- Compare hashes: Compare the hex string from the previous step with the `hash` value that was
  originally provided in the `initData`. If they match exactly, the data is valid and indeed signed by
  Eitaa, meaning you can trust the user information. If they do not match, reject the authentication
  attempt – the data may be forged or corrupted.

- Check timestamp for freshness: Eitaa provides an `auth_date` field (Unix timestamp) in the init
  data. It’s good practice to ensure the `auth_date` is recent (e.g., within the last minute) to guard
  against replay attacks. In fact, Eitaa’s documentation suggests using `auth_date` to enforce an
  expiration on the init data. If the init data is too old, you should consider it invalid and ask the
  user to re-open the mini-app to get fresh credentials.

- Use established libraries when possible: To avoid mistakes in implementing the HMAC and sorting
  algorithm, you may use well-tested libraries or reference implementations. The algorithm must be
  followed exactly as specified. (Eitaa’s documentation recommends using established libraries to
  handle the validation process to prevent errors.)

By implementing the above steps in your Django backend (using Python’s `hmac` and `hashlib` libraries,
for example), you can reliably verify the user’s identity. Once verified, you can create or update a session for
the user in Floy (e.g., log them in by their Eitaa user ID). Only after successful validation should you treat
the `initDataUnsafe.user` info as authentic. At this point, you can trust fields like `user.id`,
`first_name`, etc., and use them in your application (for example, greet the user by name or load their
preferences).

Optional: Double-Check via Eitaa Verify API
-------------------------------------------

For extra security, Eitaa offers an optional server-side verification API. After you validate the hash locally,
you can send a request to Eitaa’s verify endpoint to confirm that the hash was indeed issued by them and is
fresh. To do this, make an HTTP GET or POST request to:

`https://eitaayar.ir/api/app/verify`

Include a JSON or form payload with your app’s address. For example:

```json
{
  "token": "5768337691:AA...5AU",
  "hash": "c3bb1efcada7b75e...3e64f51d40bb9",
  "ip": "10.0.0.1"
}
```

If the data was generated by Eitaa and less than 1 minute has passed, the response will be `{ "ok":
true }`. Otherwise, you’ll get `{ "ok": false }`. Note that each hash can only be verified once
(subsequent calls will return false) and requests are rate-limited (max 20 per second per IP). This
step is not mandatory if you have implemented the local HMAC validation correctly, but it provides an
extra layer of assurance.

Using the Eitaa MiniApp JavaScript SDK (Frontend Usage)
-------------------------------------------------------

The Eitaa MiniApp JS SDK allows the Floy frontend to interact with the Eitaa app environment and utilize
features of the Eitaa platform. Below are key points and common use-cases for the SDK in Floy’s context:

- Initializing the SDK: As mentioned, include the script `eitaa-web-app.js` in your HTML head
  before any other scripts load. This creates the `window.Eitaa.WebApp` object which exposes
  Eitaa MiniApp functionalities.

- Reading User Info: After the MiniApp is launched, you can retrieve basic user information from
  `Eitaa.WebApp.initDataUnsafe` (e.g., `initDataUnsafe.user` will contain the user’s id, first
  name, last name, etc.). However, use this only after verifying the hash on the server. Initially, you
  might use it to display a loading message or the user’s first name optimistically, but any sensitive
  action should wait until the backend confirms authenticity. The `initDataUnsafe` object should
  have a structure similar to:

  ```js
  Eitaa.WebApp.initDataUnsafe = {
    user: { id: 279058397, first_name: "مهدی", last_name: "هاشمی", language_code: "fa", allows_write_to_pm: true },
    chat_type: "private",
    chat_instance: "...",
    auth_date: "1709144340",
    // ...etc...
  }
  ```

  The `allows_write_to_pm` flag indicates if the user has granted permission for your app to send
  them messages. You’ll use the `user.id` (Eitaa ID) on the backend to identify the user and to send
  messages.

- Theming and Layout: Use `Eitaa.WebApp.colorScheme` (which will be `"light"` or `"dark"`)
  to adapt the Floy app’s theme to match the user’s Eitaa app theme. The SDK also provides
  `Eitaa.WebApp.themeParams` containing detailed theme colors (background, text, button colors,
  etc.) which you can apply to your CSS for a native look. Additionally, you can control the app’s
  viewport height or expand it to full screen using `Eitaa.WebApp.expand()` and detect if your app
  is expanded via `Eitaa.WebApp.isExpanded`. After your content is ready, call
  `Eitaa.WebApp.ready()` to remove the loading indicator.

- Handling Navigation and Closure: The SDK offers controls to manage the MiniApp’s UI within Eitaa.
  For example, `Eitaa.WebApp.close()` will close the Floy mini-app programmatically. You can
  also use `Eitaa.WebApp.BackButton` and `Eitaa.WebApp.MainButton` objects to integrate
  with the Eitaa-provided back button or add a custom main button at the bottom of your app’s
  interface. These can be useful for providing consistent navigation (e.g., closing the app or
  triggering an action).

- Requesting Permissions (Contact & Write Access): Eitaa MiniApps can request certain permissions
  from the user: for instance, to send messages or to get the user’s phone number. Floy may not need
  the user’s contact for basic login (since Eitaa already provides a unique user ID), but if your app
  requires the phone number (maybe for booking verification), you can call
  `Eitaa.WebApp.requestContact()`. This will show a native popup asking the user to share their
  phone number with the app. If the user agrees, your app will receive the contact data along with
  a hash, which should be verified similarly to `initData` for authenticity.

  More importantly for Floy’s use-case, if you plan to send notification messages to the user (outside the mini-
  app context), you should ensure the user has granted write access. This permission is usually granted
  when the user first starts the mini-app via the “Start” button, but you can also explicitly request it by calling
  `Eitaa.WebApp.requestWriteAccess()`. This triggers a popup asking the user to allow the app to send
  them messages. The callback will tell you if the user granted or denied the permission. You might call
  this if `initDataUnsafe.user.allows_write_to_pm` is `false` and you need to send notifications –
  however, typically, if the user launched your app from a message or via the Start button, this will already be
  true.

- Other SDK Features: The Eitaa SDK includes many additional features (similar to Telegram’s WebApp
  API) such as opening links in the external browser (`openLink`), showing confirmation alerts
  (`showAlert`, `showConfirm`), scanning QR codes (`showScanQrPopup`), haptic feedback, sensors
  (accelerometer, gyroscope), and even adding the app to the home screen. While not
  all of these are directly relevant to Floy’s core functionality, being aware of them lets you enrich the
  app if needed (for example, scanning a QR code for a ticket, or locking orientation during a
  fullscreen view of a ticket). Refer to Eitaa’s documentation for details on these advanced features.

In summary, the JS SDK allows the Floy frontend to seamlessly integrate into the Eitaa messenger
environment, providing a native-like experience. Use it to get necessary user context (after auth), adjust to
the Eitaa app UI, and request any extra permissions you need.

Sending Messages and Notifications via Eitaa
--------------------------------------------

One powerful feature of integrating with Eitaa is the ability to send messages (notifications) to users via the
Eitaa messaging system – for example, sending booking confirmations, price drop alerts, or verification
codes directly to the user’s Eitaa chat. Floy’s backend can send these messages using Eitaa’s MiniApp API
once the user is authenticated. Here’s how to manage outgoing messages:

- Prerequisite – User Permission: Before attempting to send a message, ensure the user has given
  permission for the app to contact them. As noted, this is indicated by `allows_write_to_pm =
  true` in the user data. The user typically grants this by pressing “Start” when opening the MiniApp
  or via a direct bot link. If this flag is `false`, you cannot send them messages until they allow it (you
  might prompt them to press the start button in Eitaa or use the `requestWriteAccess()` popup
  as discussed). Without send permission, any message API call will fail.

- SendMessage API Endpoint: Eitaa provides an HTTP API for MiniApps to send messages to users.
  The endpoint is:

  `https://eitaayar.ir/api/app/sendMessage`

  Your backend (Django) should make a POST request to this URL with a JSON payload containing: the
  app token (bot token), the target `chat_id` (the user’s Eitaa ID), and the text of the message. For
  example:

  ```json
  {
    "token": "5768337691:AA...5AU",
    "chat_id": 279058397,
    "text": "سلام!\nThis is a test message from Floy."
  }
  ```

  If the request is successful and the message is sent, the API will return a response such as:
  `{ "ok": true, "result": "success" }` indicating success. Any other response or an `"ok": false`
  means the message was not delivered (e.g., missing permission or invalid token).

- Message Credits and Limits: Eitaa imposes a quota system for MiniApp messages. Each app starts
  with a free allowance of 50,000 messages. Every message sent to a user consumes 1 credit
  from this allowance. If your app exhausts these credits, you’ll need to purchase more through
  the Eitaa developer portal (Eitaayar) to continue sending messages. Always monitor your
  remaining message balance to ensure your notifications continue to work. (Floy should primarily
  send important messages like booking alerts, so 50k should be ample initially, but it’s something to
  keep in mind as you scale.)

- Use Cases for SendMessage in Floy: Once integrated, you might use this to send:

  - Booking Confirmations: After a user books a flight/hotel, send details or a confirmation code via
    Eitaa.
  - Price Drop Alerts: If a user is watching a route or hotel and the price drops, notify them instantly.
  - Verification Codes: If you implement 2FA or phone verification, you could send the code via Eitaa
    message.
  - General Notifications: Travel updates, reminders for upcoming trips, etc.

Implement the message sending in your Django backend as a simple function or service that constructs the
request to the `sendMessage` API. Ensure to handle errors (e.g., log if a message fails to send due to lack of
permission) and perhaps notify the user in-app if they need to take action (like pressing the Start button in
Eitaa to enable notifications).

Backend Setup and Requirements for Eitaa Integration
----------------------------------------------------

To support the above functionality, make sure the following are set up in Floy’s backend:

- Eitaa App Registration and Token: Register your MiniApp with Eitaa (via their developer portal) to
  obtain a bot token for the app. This token (format like `123456:ABC-DEF...`) is used for both
  validating init data and sending messages. Keep it secure (store as an environment variable or in
  Django settings, not in source code).

- User Authentication Endpoint: Create an endpoint (e.g., `/api/eitaa-auth/`) that the frontend
  can call with the `initData`. This endpoint will implement the hash verification logic as described.
  On success, it should create a session or JWT for the user so that subsequent requests in Floy
  recognize the user as logged in. For example, you might use Django’s session framework or issue a
  token linking the Eitaa user ID to a Floy user record. If the hash check fails, respond with an error
  and do not authenticate the user.

- Hash Verification Implementation: In the backend code, implement the sorting + HMAC
  verification. Pseudocode for Django (Python) might look like:

  ```python
  import hmac, hashlib

  def verify_init_data(init_data_str: str) -> dict | None:
      params = dict(item.split('=') for item in init_data_str.split('&'))
      hash_received = params.pop('hash', None)
      if not hash_received:
          return None  # No hash provided

      # 1. Sort params by key
      data_check_string = '\n'.join(f"{k}={v}" for k, v in sorted(params.items()))

      # 2. Compute first HMAC using WebAppData as key and your bot token as message
      first_hash = hmac.new(b"WebAppData", YOUR_BOT_TOKEN.encode("utf-8"), hashlib.sha256).digest()

      # 3. Compute second HMAC using first_hash as key
      second_hash = hmac.new(first_hash, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()

      # 4. Compare with received hash
      if second_hash == hash_received:
          return params  # Valid; return the parsed data (contains user info, etc.)

      return None
  ```

  (The above is a simplified example; ensure to handle encoding carefully. Also note the `WebAppData`
  usage: as per docs, `"WebAppData"` is used as a key to HMAC the bot token, then that result is
  used as the key to HMAC the data string.) Consider adding a timestamp check: `auth_date` in
  `params` should be recent (e.g., within 60 seconds) to avoid accepting old data.

- Session Management: Once verified, use the `user.id` from the data as a unique identifier. You
  may map this to an internal user in your database or simply use it directly as the user’s ID in session
  (if you don’t need additional profile info). Store whatever is needed (user id, name, etc.) in the
  session or JWT so that the frontend knows the user is authenticated. Since Floy is a travel app, you
  might not need a heavy user profile – the Eitaa identity could be enough. If you do need to persist
  user-specific settings (like saved trips), you can use the Eitaa ID as the foreign key in your database.

- Sending Message Functionality: On the backend, set up a utility to call the Eitaa `sendMessage`
  API. This could be as simple as a function that uses Python’s `requests` library to POST to
  `https://eitaayar.ir/api/app/sendMessage` with the required JSON. Make sure to
  include the bot token and the target user’s `chat_id` (Eitaa ID) which you have from the auth step.
  Also, handle the case where sending is not allowed (`ok: false` with an error) – this likely indicates
  the user hasn’t given permission. In such a case, you might log the event or update the user record
  (maybe mark that we need permission) so that next time the user opens the MiniApp, you could
  prompt them to enable messaging.

- Environment Configuration: In your deployment, ensure that the URL for Floy’s Eitaa MiniApp is
  correctly configured in Eitaa’s system (when you register the app, you provide a URL that Eitaa will
  load in the webview). Also, if your app’s URL or domain changes, update it in the Eitaa dev console to
  avoid any mismatch. The backend should be accessible via HTTPS if required by Eitaa.

- Testing in Eitaa Environment: Use Eitaa’s testing tools (or the Eitaa app itself) to open the Floy
  MiniApp in development. Note that certain features (like `Eitaa.WebApp` functions) won’t work in a
  regular browser, so you may need to use the actual Eitaa mobile/desktop app in developer mode to
  test the integration. Check Eitaa’s “Test and Debug” documentation for how to run your app in a
  sandbox mode and simulate init data if available.

By covering these backend requirements, you ensure that Floy’s integration with Eitaa is secure and robust.
The result will be a smooth login experience for users (one-tap via Eitaa) and a channel to keep users
engaged with timely notifications.

Conclusion and Next Steps
-------------------------

Following this guide, you should be able to integrate Eitaa MiniApp authentication and messaging into the
Floy project. In summary, the process involves using Eitaa’s hash-based auth to log users in, verifying that
data on your Django backend for security, leveraging the Eitaa JS SDK on the frontend for a native app feel,
and sending out notifications through Eitaa’s messaging API. With the integration in place, Floy can offer a
seamless experience to Eitaa users, lowering the barrier to entry (no separate signup) and providing
valuable real-time updates on their travel plans.

Be sure to keep Eitaa’s documentation handy for any advanced features or updates:

- Authorization via Hash: Details the login payload and signature verification.  
  https://developer.eitaa.com/docs/Develop/AuthorizationViaHash/
- Validate Hash: Describes the optional verify API for double-checking auth data.  
  https://developer.eitaa.com/docs/Develop/ValidateHash/
- JavaScript SDK: Lists all properties and methods available for MiniApp frontend development.  
  http://developer.eitaa.com/docs/Develop/JsSDK/
- Send Message: Provides the API endpoint and requirements for sending messages to users.  
  http://developer.eitaa.com/docs/Develop/SendMassage/

With these resources and the steps outlined above, agents working on the Floy repo should have clear
guidance on integrating and working with Eitaa MiniApps. Happy coding, and enjoy the enhanced
connectivity with your users through Eitaa!

