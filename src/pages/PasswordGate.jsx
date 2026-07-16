import { useState } from "react";
import { useAuth, login, authErrorMessage } from "../lib/auth";
import "./Admin.css";

// Real Firebase Auth gate. Only signed-in users reach the admin.
// Create admin users in Firebase Console -> Authentication -> Users -> Add user.

export default function LoginGate({ children }) {
  const user = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login(email.trim(), password);
      // onAuthStateChanged flips `user` and renders children automatically.
    } catch (ex) {
      setErr(authErrorMessage(ex.code));
    }
    setBusy(false);
  }

  // Still checking the session
  if (user === undefined) {
    return (
      <div className="gate">
        <div className="gate-box"><p>Checking sign-in…</p></div>
      </div>
    );
  }

  // Signed in -> show the admin
  if (user) return children;

  // Signed out -> login form
  return (
    <div className="gate">
      <form className="gate-box" onSubmit={submit}>
        <img src="/nsib-crest.png" alt="NSIB" width="64" />
        <h1>Admin sign in</h1>
        <p>Sign in to manage cards.</p>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(""); }}
          placeholder="Email"
          autoComplete="username"
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setErr(""); }}
          placeholder="Password"
          autoComplete="current-password"
        />
        {err && <span className="gate-err">{err}</span>}
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
