# NSIB Digital Business Cards

NSIB-branded digital business cards — QR + NFC, one profile per person, backed by
Firebase Realtime Database with a Firebase-authenticated admin panel. Built with Vite + React.

## Pages
- `/`            Team directory (public, live from the database)
- `/c/<slug>`    A person's card — Save contact (vCard), Share. Admin also sees QR + NFC tools.
- `/admin`       Sign-in-protected panel to add / edit / delete cards

## 1. Set up Firebase
1. Create a project at https://console.firebase.google.com
2. Build -> Realtime Database -> Create database (location: Singapore is closest to Dubai).
3. Build -> Authentication -> Get started -> enable "Email/Password" sign-in.
4. Authentication -> Users -> Add user -> create your admin login (email + password).
   Repeat for each person who should be able to edit cards.
5. Realtime Database -> Rules -> paste the contents of firebase-rules.json and Publish:
       { "rules": { "cards": { ".read": true, ".write": "auth != null" } } }
   This makes cards publicly readable but writable only by signed-in users.

## 2. Configure the app
    cp .env.example .env.local
Fill in the Firebase config values (Project settings -> your web app -> SDK config).
No admin password is needed anymore — the admin logs in with a real Firebase account.

## 3. Run locally
    npm install
    npm run dev
Open http://localhost:5173. Go to /admin, sign in with the user you created, add cards.

## Add / edit cards
Go to /admin and sign in. The URL slug is generated from the name when creating
(and stays fixed after). Empty fields are hidden on the card. Changes appear instantly.
Only signed-in users see the QR + "Write to NFC tag" tools on a card.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Import into Vercel -> preset Vite (auto-detected).
3. Add the VITE_FB_* env vars in Vercel -> Settings -> Environment Variables.
4. Deploy.
5. IMPORTANT: in Firebase -> Authentication -> Settings -> Authorized domains,
   add your Vercel domain (e.g. nsib-cards.vercel.app) and any custom domain,
   or sign-in will be blocked on the live site. (localhost is allowed by default.)

## NFC tags
Buy blank NTAG213/215/216 tags. Sign in, open a card on Android+Chrome,
tap "Write to NFC tag," hold a blank tag to the phone. Or use the NFC Tools app
(works on iPhone too): Write -> URL -> paste the card's live URL.

## Security model
- Cards are public to read (they're business cards — meant to be seen).
- Writes require a signed-in Firebase user. The database URL being visible in the
  client is harmless: without a valid login, nobody can modify data.
- Manage who can edit by adding/removing users in Firebase Authentication.

## Files worth knowing
- src/lib/firebase.js  Firebase init (db + auth) from env vars
- src/lib/auth.js      useAuth hook + login/logout helpers
- src/lib/cardsDb.js   All DB reads/writes + realtime hooks
- src/pages/PasswordGate.jsx  Login gate (Firebase email/password)
- src/pages/Admin.jsx  Add / edit / delete UI + sign out
- seed-data.json       Starter cards (Kiran + a demo)
