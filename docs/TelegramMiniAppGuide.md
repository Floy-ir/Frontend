Floy Project – Telegram Mini App Guide
Introduction
Telegram Mini Apps are web-based applications that run inside Telegram, offering a richer UI/UX on top of
Telegram bots. In the Floy project, we use a Telegram Mini App to extend our bot’s functionality with a
native-like interface for users. A Mini App is essentially an add-on to a Telegram Bot, not a standalone
service – you cannot create a Mini App without first creating a Telegram bot 1
. By leveraging Mini Apps,
we can provide more user-friendly, complex interfaces beyond the “console-like” experience of standard bot
commands 2
. The Mini App loads within Telegram’s client and can communicate with it to simulate native
3
app behavior via provided APIs .
What does this mean for front-end developers? In practical terms, a Telegram Mini App is just a web
application loaded in a Telegram WebView. Internally it’s a set of static web files (HTML, CSS, JS) displayed
inside Telegram 4
. You can use any modern front-end tech stack to build it – plain JavaScript, CSS, HTML,
or frameworks like TypeScript/React/SCSS for larger apps 5
. Telegram simply needs a URL where your
app is hosted, and it will load that URL inside the Telegram app’s webview 6
. In summary, building a Mini
App is very similar to building any web app, with the addition of Telegram-specific context and APIs.
Supported Telegram Clients: Not all Telegram apps support Mini Apps equally. For development and
7
testing, use one of the official clients that fully support Mini Apps :
•
•
•
•
•
Telegram for Android
Telegram for iOS
Telegram for macOS
Telegram Desktop
Telegram Web (Telegram Web A or K)
Other or older clients may not support Mini Apps or have incomplete support above platforms.
8
, so ensure you test on the
Getting Started: Setting Up Your Telegram Mini App
9
To build and test your Mini App, follow these basic steps :

1.  Create a Telegram Bot & Mini App Entry: Using your Telegram account, start a chat with BotFather.
    Create a new bot by sending /newbot and following the prompts. Once the bot is created, register
    a new Mini App via BotFather with the command /newapp . This links a Mini App to your bot (give it
    a name when prompted). After this, Telegram provides a direct link of the form https://t.me/
    10
    <yourBot>/<yourApp> for your Mini App .
    1
2.  Develop the Web Application: Build your front-end application as you normally would (you can use
    the Floy project’s stack or any framework of your choice). Ensure the app is reachable via a web URL.
    During development, you can host it locally or on a dev server. Tip: It’s recommended to use
    Telegram’s Test Environment for development, which allows using http:// or even IP addresses
    for the app URL (production requires HTTPS links) 11
    . We’ll cover how to use the test environment
    shortly.
3.  Provide the App URL to Telegram: Once your app is running on a URL, connect it to the bot via
    BotFather. If you created a Mini App in step 1, use /myapps in BotFather to find your app and then
    “Edit link” to set the URL of your web app 12
    . (If you didn’t use /newapp , you can alternatively
    attach a web app to the bot’s menu button via /setmenubutton 13 14
    ). After setting the link,
    users (or your test account) can open the Mini App either by clicking the menu button in the bot’s
    15
    chat (if configured) or by visiting the direct link https://t.me/<yourBot>/<yourApp> in
    Telegram 16
    . This will load your web app inside the Telegram interface.
    Note: Always perform these setup steps in Telegram’s Test Environment during
    development 17
    . The test environment is a special sandbox server for Telegram that lets you
    create test bots and use non-HTTPS URLs for Mini Apps 11
    . Development in the production
    18
    environment is strongly discouraged .
    Telegram Test Environment (for Development)
    Telegram’s test environment allows you to have a separate Telegram account for development and to use
    insecure/local URLs for your Mini App link 19
    . You’ll need to create or log into a test server account in
    Telegram (this is separate from your normal Telegram cloud). Currently, new test accounts can only be
    created via mobile Telegram apps 20
    , but they can be used on Desktop once created. Here’s how to set it
    up:
    • 21
    On Telegram for iOS: In the app, go to Settings and tap the section header 10 times rapidly . This
    reveals an Accounts debug menu. Tap “Accounts” > “Login to another account” > then tap the Test
    button. You can now register a new account on the test server (use a spare phone number for
    verification).
    •
    •
    On Telegram Desktop: If you already made a test account on mobile, you can log into it on Desktop.
    In Telegram Desktop, open the side menu, expand your account menu at the top, then Shift + Alt +
    right-click on the “Add Account” button. Choose “Test Server” from the context menu 22
    and log in
    with the test account credentials.
    On Telegram for macOS: Similarly, tap the Settings icon 10 times to open the Debug menu, then
    23
    hold Cmd and click “Add Account”. Select the Test server and log in .
    Once you have a test environment account, use that account with BotFather to create your bot and Mini
    App (Step 1 above) and to test your Mini App. Remember to run the Telegram app (Desktop or mobile) on
    the test server account when you are loading your Mini App for development, so that Telegram will accept
    19
    your dev link (HTTP or localhost) .
    2
    Building the Front-End Application
    When building the Mini App front-end, you can treat it like a normal single-page application or web app.
    Use the Floy project’s existing tooling or any framework you prefer (React, Vue, etc.). No special
    compilation is needed for Telegram – the Mini App will simply load your web page in an embedded
    browser. Keep in mind a few specifics:
    •
    •
    App URL: Telegram loads the Mini App from a URL you provide. If developing locally, you might use
    an IP address or http://localhost with the test environment. In production, you must use
    11
    HTTPS (e.g., deploy to a secure domain) .
    Initialization Parameters: When the Mini App launches inside Telegram, Telegram passes launch
    parameters to your app via the URL hash ( window.location.hash ). This includes useful info like
    the user’s Telegram name/ID, the app’s theme colors, platform, etc. 24 25
    . For example, you’ll see a
    hash string with keys like tgWebAppData, tgWebAppThemeParams, tgWebAppPlatform , etc.
    Your app should read these parameters on startup.
    Parsing Launch Parameters: You can extract these values in your front-end code. For instance:
    // Get the URL hash and parse it as query params
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    console.log(params.get('tgWebAppVersion')); // e.g. "6.2"
    // Example: get user data and theme from params
    const initData = params.get('tgWebAppData');
    const themeJSON = params.get('tgWebAppThemeParams');
    const theme = themeJSON ? JSON.parse(themeJSON) : null;
    26
    In the above, tgWebAppVersion indicates the Mini Apps platform version (which you can use to ensure
    certain API methods are supported) 27
    . The tgWebAppData contains a JSON payload with the current
    user’s basic info and a verification data hash 28
    . The tgWebAppThemeParams is a JSON string of
    Telegram’s current theme colors (background, text, button colors, etc.), which you can parse to adapt your
    app’s styling to Telegram’s theme 29
    . It’s a good idea to apply these theme colors so your app feels native
    30 31
    to Telegram .
    Pro Tip: Read and store the launch parameters once at startup. If your app is a Single Page
    Application with client-side routing (e.g., using hash routes), a user might refresh or navigate
    in-app and lose the initial window.location.hash . Save what you need (user info, theme,
    32
    etc.) from the launch params on initial load .
    Telegram Mini App JavaScript API
    Telegram provides a JavaScript interface that allows your web app to interact with the Telegram client. This
    is how you control Telegram-specific UI elements (like the Back button, Main button, etc.) and respond to
    3
    user actions (like button clicks) inside Telegram. The interaction happens via methods (requests from your
    Mini App to Telegram) and events (notifications from Telegram to your app).
    Calling Telegram API Methods (Controlling Telegram UI)
    In web (Telegram Web or in-app browser) context, your Mini App communicates with Telegram by sending
    messages to the parent frame. Under the hood, your app can call window.parent.postMessage() a JSON that Telegram listens for 33
    . Each Telegram action is identified by an eventType with
    and optional
    eventData payload 34
    . For example, to make the Telegram Back Button visible, you send a message
    with event type "web_app_setup_back_button" :
    const data = JSON.stringify({
    eventType: 'web_app_setup_back_button',
    eventData: { is_visible: true }
    });
    window.parent.postMessage(data, 'https://web.telegram.org');【11†L111-L119】
    In the code above, we post a message to the Telegram WebView’s parent with the specified event. It’s
    important to target Telegram’s origin (e.g. https://web.telegram.org ) rather than using \* , for
    security 35 36
    . This particular call tells Telegram to show the Back Button in the UI .
    On mobile and desktop Telegram apps, the mechanism differs slightly: Telegram injects a JavaScript
    bridge. Instead of postMessage , those apps expose a global function
    37
    window.TelegramWebviewProxy.postEvent(eventType, data) for the Mini App to call . The
    usage is similar – you pass the event name and a JSON-stringified data object. For instance, the above
    example on mobile would be:
    window.TelegramWebviewProxy.postEvent('web_app_setup_back_button',
    JSON.stringify({ is_visible: true }));【11†L133-L140】
    Handling these differences manually can be tedious. We recommend using the community SDK sdk , which abstracts the environment differences and provides convenient helpers 38
    @tma.js/
    . After installing the
    package, you can call Telegram methods with a single function. For example, using the SDK to change the
    header color:
    import { postEvent } from '@tma.js/sdk';
    postEvent('web_app_set_header_color', { color_key: 'bg_color' });【11†L163-
    L169】
    The SDK will internally choose the correct approach (postMessage vs TelegramWebviewProxy )
    depending on where the app is running. You can use postEvent to call any Mini App method by name,
    4
    such as 'web_app_setup_main_button' to configure the main button, 'web_app_open_popup' to
    open a popup, etc. (See the official docs for the full list of method names and their parameters.)
    Telegram UI Elements: Back Button and Main Button
    Telegram Mini Apps allow you to integrate with the Telegram interface. Two common UI elements you
    might use are the Back Button (a top navigation back arrow) and the Main Button (a prominent button at
    the bottom of the interface).
    Back Button: Telegram’s Back Button provides a native-looking way to navigate or go “back” in your app’s
    flow. As shown earlier, you can make it visible by calling the web_app_setup_back_button method with
    is_visible: true 36
    . By default, the Back Button doesn’t perform any action when clicked – it’s up to
    your app to decide what happens (e.g., navigate to a previous page in your app). When the user clicks the
    back button, Telegram will emit a back_button_pressed event to your app 39
    . Typically, you would
    listen for that event and then respond (for example, by calling window.history.back() or closing a
    modal in your app).
    Main Button: The Main Button is a large button shown at the bottom of the Mini App interface, often used
    for a final or primary action (such as “Submit” or “Checkout”) 40
    . It’s hidden by default and you control it via
    the web_app_setup_main_button method – you can set its text, enable/disable its state, show a loading
    indicator on it, and adjust its color 41
    . For example, once a user has filled their cart in a shopping Mini App,
    you might enable the Main Button with text “Place Order”. When the Main Button is clicked, Telegram
    sends a main_button_pressed event to your app 42
    . You should handle this event to perform the final
    action (for instance, send the order data to your backend or trigger a confirmation in the UI).
    The Telegram Main Button (bottom bar) in a Mini App interface. Developers control the button’s text, color, and
    40 41
    visibility via Mini App API methods, and handle its click event ( main_button_pressed ) in their code .
    Listening for Events from Telegram
    Telegram will notify your Mini App of various events through a JavaScript event system. In web
    environments, Telegram uses the standard postMessage API to send events to your window. That means
    you can attach an event listener for "message" 43
    events on the window to catch these notifications .
    Each event comes through as a JSON string (containing an eventType and eventData similar to the
    format used for methods). For example, to listen for incoming events:
    window.addEventListener('message', (event) => {
    const { eventType, eventData } = JSON.parse(event.data);
    console.log('Event received:', eventType, eventData);【9†L110-L117】
    // e.g. handle certain events:
    if (eventType === 'back_button_pressed') {
    // User tapped the Back button – handle navigation
    window.history.back();
    }
    if (eventType === 'main_button_pressed') {
    // Main button clicked – perform final action (e.g., submit form)
    5
    submitDataToServer(); // (pseudo-function, implement as needed)
    }
    });
    Note: In a real app, ensure the message event actually originated from Telegram and that
    44
    event.data is a string before parsing . You might check event.origin or other
    measures to avoid processing unintended messages.
    On Telegram Desktop/Mobile (non-web), the mechanism is slightly different. Instead of window messages,
    Telegram injects a global call to deliver events. It calls a function like
    45
    window.Telegram.WebView.receiveEvent(eventType, eventData) internally . To handle these,
    you would define window.Telegram.WebView.receiveEvent (and a couple of platform-specific
    variants) in your code. However, using the @tma.js/sdk again simplifies this. The SDK provides an on
    function to listen to events in a unified way 46
    . For example:
    import { on } from '@tma.js/sdk';
    // Start listening for a Telegram event (e.g., viewport changes)
    const removeListener = on('viewport_changed', payload => {
    console.log('Viewport changed:', payload);
    });【9†L162-L170】
    // ... later, if you want to stop listening:
    removeListener();
    You can use on('<event_name>', callback) for any event. For instance,
    on('main_button_pressed', callback) to handle the main button, or on('theme_changed',
    callback) if you call a method to change theme, etc. The SDK takes care of wiring up the correct event
    source across web, mobile, and desktop. (Under the hood it registers the necessary receiveEvent
    function or message listener for you.)
    Some useful events to know: back_button_pressed, main_button_pressed, theme_changed (fired
    when Telegram’s theme or palette changes, e.g., user switches dark mode), popup_closed (if you opened
    a Telegram popup), and more. Consult the documentation for a full list of events and their payloads.
    Testing and Debugging the Mini App
    Developing a Mini App means you’ll frequently need to test it inside Telegram to ensure the Telegram JS
    APIs and UI integrations work correctly. This section covers how to run your Mini App in Telegram during
    development and how to enable debugging tools.
4.  Opening the Mini App for Testing: After linking your Mini App URL to the bot (in the test environment),
    you can open it in Telegram. If you used the menu button approach, simply open a chat with your test bot
    in the Telegram app – you should see a menu or “⋮” button near the message input; tapping it will open your
    15
    web app inside Telegram . If you set up a direct Mini App link, navigate to
    6
    https://t.me/<yourBot>/<yourApp> on the Telegram app (or in Telegram Desktop) while logged in
    16
    with your test account. The Mini App will load in the Telegram interface .
    For local development, ensure your dev server is reachable: if your computer and phone are on the same
    network, you might use an IP address (e.g., http://192.168.x.x:3000 ) for the Mini App URL. The
    Telegram test environment will accept that URL 19
    . Alternatively, consider using a tunneling service (like
    ngrok) to expose your local server with HTTPS if needed.
5.  Enabling Developer Tools (WebView Debugging): To debug and inspect your Mini App, Telegram
    provides a way to open WebView DevTools on certain platforms (in debug mode). Below are platform-
    47 48
    specific steps to enable the inspector :
    • 49
    Telegram Desktop (Beta): Install the latest Telegram Desktop Beta version . In the app, go to
    Settings > Advanced > Experimental Settings and check “Enable webview inspecting” 50
    . After
    enabling, open your Mini App and right-click anywhere – you should see an “Inspect” option that
    opens the Chrome DevTools for the embedded webview 51
    . This lets you use the Elements panel,
    console, network, etc., just like in a regular browser.
    • 52
    Telegram for macOS (TestFlight/Beta): Use the Telegram macOS beta gear icon 5 times quickly to reveal the debug menu. Enable “Debug Mini Apps” there 54
    Desktop, you can then right-click in the Mini App to open Web Inspector .
    and click the Settings
    53
    . Similar to
    •
    Telegram for Android: In Telegram’s settings, scroll to the bottom, then tap and hold on the app
    version number (about page) twice to enter Debug mode. In the debug settings, enable “Enable
    WebView Debug” 55
    . Next, on your development machine, open Chrome and go to chrome://
    inspect/#devices . With your Android device connected via USB (and with USB debugging
    enabled on the device 56
    ), you will see the Telegram WebView listed for inspection when the Mini
    App is open on your phone 57
    . This allows you to use Chrome DevTools to inspect the mobile
    webview remotely.
    •
    Telegram for iOS: iOS WebView debugging is done through Safari on a Mac. First, on the iOS device
    enable Web Inspector in Settings > Safari > Advanced 58
    . Then, on your Mac, open Safari, go to
    Preferences > Advanced, and enable “Show Develop menu” 59
    . Connect your iPhone/iPad to the
    Mac via USB, launch the Mini App on Telegram iOS, then in Safari’s top menu bar go to Develop –
    you should see your device and the Telegram webview listed for inspection 60
    . Selecting it will open
    a Web Inspector for the Mini App. (If you don’t have access to a Mac for Safari debug, you can use
    the alternative approach below.)
6.  Using an In-App Debug Console (Eruda): In cases where connecting a debugger is difficult (e.g., on iOS
    without a Mac), you can include a lightweight web console directly in your app using Eruda 61
    . Eruda is a
    JavaScript library that brings a floating debug console into your web app – useful for viewing logs and
    inspecting the DOM on the fly. To use it, add the following script only in development:
    <script src="//cdn.jsdelivr.net/npm/eruda"></script>
    <script>eruda.init();</script>
    62
    7
    This will add a draggable debug icon in your app; tapping it opens a console and inspector interface within
    63
    the Mini App itself . You can also install via npm ( import eruda from 'eruda'; eruda.init(); as
    shown in the docs 64
    ) if that fits your build process. Be sure to remove or disable Eruda in production
    builds.
    With these tools, you should be able to test your Mini App thoroughly. Log in with your test account, open
    the Mini App in Telegram, and use the DevTools or Eruda console to debug issues. You can inspect network
    calls, DOM elements, and see console output to troubleshoot any problems just as you would in a normal
    web app.
    Conclusion and Next Steps
    By following this guide, a new front-end developer on the Floy project should be able to set up a Telegram
    Mini App, build its UI with familiar web technologies, integrate Telegram’s Mini App APIs, and test it in
    Telegram’s environment. We covered the essential concepts from the Telegram Mini Apps documentation –
    from required setup with BotFather to using launch parameters and the JavaScript API methods/events – all
    with a focus on front-end implementation.
    With your Mini App running, the next steps typically involve coordinating with the backend (your Telegram
    bot) to handle data exchange. The Mini App can send data to the bot (e.g., via main_button_pressed
    events or Telegram’s Web Apps data transfer methods) and receive responses, but those details involve bot
    logic and are beyond our front-end scope here. For now, you should have a solid foundation to build and
    test the Mini App’s front-end. Refer to the official Telegram Mini Apps docs for more in-depth information
    and updates 65
    , and happy coding!
    1 2 3 4 5 6 7 8 65
    About the Platform | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/about
    9 10 11 12 13 14 15 16 17 18
    Creating New App | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/creating-new-app
    19 20 21 22 23
    Test Environment | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/test-environment
    24 25 26 27 28 29 32
    Launch Parameters | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/launch-parameters
    30 31
    Theming | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/theming
    33 34 35 37 38
    Methods | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/methods
    36 39
    Back Button | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/back-button
    40 41 42
    Main Button | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/main-button
    8
    43 44 45 46
    Events | Telegram Mini Apps
    https://docs.telegram-mini-apps.com/platform/events
    47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64
    https://docs.telegram-mini-apps.com/platform/debugging
    Debugging | Telegram Mini Apps
    9
