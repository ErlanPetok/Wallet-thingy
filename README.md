# 🌸 Hoshino's Daily 🌸

> Your clean & cozy wallet tracker~ 🐋

A cozy, wallet tracker themed around  my wifey **Hoshino** from *Blue Archive*. Track your daily spending, gains, and streaks — all in one cute, self-hosted app. No backend, no accounts, no tracking. Just you and Hoshino.

---

## 📖 What is this?

Hoshino's Daily is a **single-page web app** (installed as a PWA) that lives entirely in your browser. Every transaction you log, every custom song you add, every setting you tweak — it all stays on **your device**, stored in `localStorage` and `IndexedDB`.

Open it, poke Hoshino a few times, log your coffee, and let the little sleepy girl keep an eye on your wallet. That's it.

---

## ✨ Features

### 💼 Wallets
- **Multiple wallets** — Main, Savings, Snack Fund, whatever you like
- **Per-wallet currency** — 🇮🇩 IDR, 🇺🇸 USD, 🇯🇵 JPY, 🇪🇺 EUR
- **Wallet photos** — give each wallet its own face
- **Long-press a wallet tab** to rename, change photo, change currency, or delete

### 💸 Transactions
- **Gain (+) / Spend (-)** entries with date, description, and optional note
- **Search & filter** — by description, note, date, or type (gains / spends / noted)
- **Undo delete** — a 5-second window to change your mind
- **Inline edit** — tap any entry to expand its edit drawer
- **Monthly summary** — income, spending, net, last-7-days bar chart, highest spend day, top weekday

### 💳 Bill Denominations
- Optional per-wallet **denomination tracking** (bill counts instead of raw numbers)
- Currency-aware grids: 1k/2k/5k/10k/20k/50k/100k for IDR, $1–$100 for USD, etc.
- **🔁 "Include change" mode** — log pay-and-change in one entry (e.g. pay 50k, get 15k back → net spend 35k)
- **Adaptive labels** — "Bills Paid / Change Received" for spends, "Bills Received / Change Given" for gains
- Bill-count summary at the top of the balance card stays physically accurate

### 🎵 Music
- **5 time-of-day BGM tracks** — morning, noon, afternoon, night, late night
- **⏭️ Next track** — cycle through the playlist manually
- **🕐 Clock-following** — auto-switches when the time period changes (unless you override)
- **▶ / ❚❚ playback** with a **progress slider** — drag to seek, live `0:45 / 3:20` display
- **🎧 My Playlist** — add your own songs (max 10 MB each, OGG/MP3/M4A/WAV)
- **Custom songs persist** via IndexedDB and join the ⏭️ cycle

### 🌸 Hoshino
- **7 expressive sprites** — normal, squished, sleepy, happy, joking, surprised, embarrassed
- **Poke her** — squish animation, sound effect, and a random line of dialogue
- **Typewriter dialogue** — types char-by-char with punctuation pauses (toggleable)
- **Mood Overtime** — her expression reacts to the time of day, your spending, and your streak
- **Streak system** — 🔥 badge for consecutive days logged, with milestone reactions at 3 / 7 / 14 / 30 / 100 days
- **Transaction reactions** — she comments on gains, spends, big purchases, and daily over-spends

### 🎨 Themes
Four cozy color palettes, each fully remapped:
- 🌸 **Pink** (default)
- 🌙 **Night**
- 🌊 **Ocean**
- 🌻 **Spring**

### ⚙️ Settings
- **Dialogue speed** — 10ms (hyper) to 120ms (slow and sleepy)
- **Page size** — 70%–140% scale for bigger or smaller UI
- **Typewriter effect** toggle
- **Mood Overtime** toggle
- **Background presets** — 8 Abydos/Committee Room scenes
- **Custom background** upload (JPEG compressed, GIF supported)
- **Card opacity slider** — how transparent the main panel is
- **Daily reminder** — a gentle nudge once per day when the app is open

### 💾 Backup
- **Export** — one `.json` file with all your wallets, transactions, chips, settings, and streaks (custom audio **not** included — see below)
- **Import** — restore on any device
- Custom song metadata travels in the backup so the app can prompt you to re-upload them on a new device

---

## 🚀 Getting Started

### Option 1 — Just use it
If you (or someone) has already deployed this repo on GitHub Pages, just open the URL and tap **"Add to Home Screen"** / **"Install App"**. That's it.

### Option 2 — Self-host it

1. **Clone or download** the repo
2. **Serve it** — any static host works:
   - GitHub Pages (recommended — free, HTTPS)
   - Netlify (drag-and-drop deploy)
   - Any static file server
3. **Open the URL** in your browser
4. **Install it** as a PWA from the browser menu

> 💡 **Note:** For PWA features (offline support, home-screen icon, standalone mode) to work, the site must be served over **HTTPS** (or `localhost`).

---

**Filenames are case-sensitive.** On GitHub Pages, `Bgm_Morning.ogg` will 404 where `bgm_morning.ogg` works. Match them exactly.

---

## 💾 Data & Privacy

- **Everything is local.** No backend, no telemetry, no analytics, no cloud sync.
- **Wallets, transactions, chips, settings** → `localStorage`
- **Custom songs** → `IndexedDB` (blobs; separate from `localStorage` so they don't eat the 5MB cap)
- **Background images** → `localStorage` as compressed JPEGs
- **Export backups** do **not** include custom song audio (they'd balloon to tens of MB). Only the song names travel in the backup; the app prompts you to re-upload on a new device.

If you clear site data in your browser, everything is gone — **so export regularly** if you have transactions you care about.

**Notes:**
- Audio autoplay: browsers block unmuted autoplay until you interact. On installed PWAs it works immediately; in a browser tab, first tap plays music. This is by design.
- OGG audio is best supported on Chrome/Firefox. Safari plays it on recent versions; if you have problems, convert to MP3 and update the `audio/` p
## 🎨 Customizing

### Change the song titles shown
Open `index.html` and find `const trackTitles = {...}`. Edit the strings — no rebuild needed.

### Change the time periods
Find `function getTimePeriod()`. The current split is:
- 05:00–11:00 morning
- 11:00–15:00 noon
- 15:00–19:00 afternoon
- 19:00–23:00 night
- 23:00–05:00 latenight

### Add a currency
Add an entry to `const CURRENCIES = {...}` at the top of the script, following the shape of the existing ones (`code`, `symbol`, `name`, `decimals`, `denoms`, `denomLabels`).

### Swap Hoshino's sprites
Replace the PNGs in `expression/`. Same filenames, same dimensions recommended (~200×200 or larger square).

---

## 🐛 Known Limitations

- **Currency switching** on a wallet with existing transactions will reinterpret the stored cent values — the app warns you before doing it.
- **Autoplay** is subject to browser policy (see above).
- **Custom music** is limited to 10 MB per track (IndexedDB quota + mobile browser stability).
- **Notifications** only fire while the app is open (true push would need a backend).
- **GIF backgrounds** work but are limited to ~1 MB (localStorage quota).

---

## 🙏 Credits

- **Hoshino** (TakanashiHoshino) — *Blue Archive* (Nexon Games / Yostar)
- **Sprites, backgrounds, audio** — from the *Blue Archive* assets, used here as non-commercial fan content
- **Code** — this repo
- **You** — for giving the old-timer something to do besides nap 🌸

This is a **fan project** and is not affiliated with NEXON Games, Yostar, or Blue Archive. All character assets remain the property of their respective rights holders.

---

## 📜 License

The **code** in this repository is available under the [MIT License](LICENSE) — do whatever you like with it.

**Character assets (Hoshino sprites, backgrounds, music)** are **not** covered by MIT and remain property of their original rights holders. Do not redistribute them commercially.

---

## 💖 Special Thanks

To every Sensei who checks their wallet instead of just refilling it. Hoshino is proud of you. 💤
and to AI for making this possible for me
