# NSIB Digital Business Cards

NSIB-branded digital business cards — QR + NFC, one profile per person, backed by
Firebase Realtime Database with a simple admin panel. Built with Vite + React.

## Pages
- `/`            Team directory (live from the database)
- `/c/<slug>`    A person's card — Save contact (vCard), QR code, Write to NFC tag, Share
- `/admin`       Password-protected panel to add / edit / delete cards

## 1. Set up Firebase
1. Create a project at https://console.firebase.google.com
2. Build → Realtime Database → Create database (start in locked mode).
3. Project settings → General → Your apps → Web app → copy the config values.
4. Realtime Database → Rules → paste the contents of `firebase-rules-passwordgate.json`
   and Publish. (See "Security" below before going live.)

## 2. Configure the app
    cp .env.example .env.local
Fill in the Firebase values and set VITE_ADMIN_PASSWORD.

## 3. Run locally
    npm install
    npm run dev
Open http://localhost:5173

## 4. Seed the first cards
Easiest: open `/admin`, unlock, click "+ New card", add Kiran (IT Lead) and others.
Or import in bulk: Realtime Database → ⋮ menu → Import JSON → choose `seed-data.json`.

## Add / edit cards
Go to `/admin`. The URL slug is generated from the name when creating (and stays fixed
after that). Empty fields are hidden on the card. Changes appear instantly everywhere.

## Deploy to Vercel
1. Push this folder to a repo (e.g. under the NuonConnect org).
2. Import into Vercel → preset Vite (auto-detected).
3. Add the same VITE_* env vars in Vercel → Settings → Environment Variables.
4. Deploy. `vercel.json` already rewrites all routes so `/c/<slug>` and `/admin` work.

## NFC tags
Buy blank NTAG213/215 tags/cards. On Android + Chrome: open a card →
Write to NFC tag → hold the blank tag to the phone. Tapping it then opens that card.
(iPhones can read written tags; only Chrome-on-Android can write them.)

## Security — read this
The admin is guarded by a shared password in the browser. Firebase can't verify that
password, so `firebase-rules-passwordgate.json` leaves writes open — anyone who finds
the database URL could technically write. That's acceptable for an internal tool, but
the proper fix is Firebase Authentication:
- Add Firebase Auth (email/password) to the admin, then swap the gate for an auth check.
- Publish `firebase-rules-auth.json` so only signed-in users can write; reads stay public.
Ask to have this upgraded when you're ready.

## Files worth knowing
- `src/lib/firebase.js`  Firebase init from env vars
- `src/lib/cardsDb.js`   All DB reads/writes + realtime hooks
- `src/pages/Admin.jsx`  Add / edit / delete UI
- `seed-data.json`       Starter cards (Kiran + a demo)
