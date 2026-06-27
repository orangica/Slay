# Slay

A small interactive prototype for testing the feel of Slay. This first pass does not store user data; chat replies are generated through Gemini when `GEMINI_API_KEY` is configured.

## Local setup

1. Copy `.env.example` to `.env`.
2. Put your Gemini key in `.env`:

```bash
GEMINI_API_KEY=your_key_here
```

3. Start the app:

```bash
npm start
```

4. Open `http://localhost:8787`.

## Railway

The app is Railway-ready with `npm start` and `railway.json`.

In Railway, open your Slay service, then add these variables under **Variables**:

```bash
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_THINKING_BUDGET=1024
```

Only `GEMINI_API_KEY` is required. Railway provides `PORT` automatically.

## Prototype links

You can make unique no-storage tester links with query parameters:

```text
https://your-railway-url.up.railway.app/?name=Maya&skipIntro=1
https://your-railway-url.up.railway.app/?name=Lee&demon=Doomscroll%20Siren&mode=fight
https://your-railway-url.up.railway.app/?guest=Ari&companion=Kat&screen=demons
```

Supported parameters: `name`, `guest`, `player`, `companion`, `demon`, `screen`, `mode`, `skipIntro`, and `previewTime=late`.
