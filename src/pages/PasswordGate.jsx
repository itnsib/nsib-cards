import { useState } from "react";
import "./Admin.css";

// Simple shared-password gate. The password is set via VITE_ADMIN_PASSWORD.
// This guards the UI; the real protection for your data is Firebase security rules.
// Unlock persists for the browser session only (sessionStorage).

const KEY = "nsib_admin_ok";

export default function PasswordGate({ children }) {
  const [ok, setOk] = useState(() => sessionStorage.getItem(KEY) === "1");
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    const expected = import.meta.env.VITE_ADMIN_PASSWORD;
    if (!expected) {
      setErr("No admin password is configured. Set VITE_ADMIN_PASSWORD.");
      return;
    }
    if (input === expected) {
      sessionStorage.setItem(KEY, "1");
      setOk(true);
    } else {
      setErr("Incorrect password.");
      setInput("");
    }
  }

  if (ok) return children;

  return (
    <div className="gate">
      <form className="gate-box" onSubmit={submit}>
        <img src="/nsib-crest.png" alt="NSIB" width="64" />
        <h1>Admin access</h1>
        <p>Enter the admin password to manage cards.</p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setErr(""); }}
          placeholder="Password"
          autoFocus
        />
        {err && <span className="gate-err">{err}</span>}
        <button type="submit" className="btn primary">Unlock</button>
      </form>
    </div>
  );
}
