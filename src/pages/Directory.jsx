import { Link } from "react-router-dom";
import { useCards, company } from "../lib/cardsDb";
import "./Directory.css";

export default function Directory() {
  const { cards, error } = useCards();

  return (
    <div className="dir">
      <header className="dir-hero">
        <img className="dir-logo" src="/nsib-logo.png" alt="New Shield Insurance Brokers L.L.C." />
        <p className="dir-tag">Your Insurance Channel Partner</p>
        <p className="dir-sub">Digital business cards — tap or scan to connect.</p>
      </header>

      <main className="dir-grid">
        {error && <p className="dir-msg error">Could not load cards: {error}</p>}
        {cards === null && !error && <p className="dir-msg">Loading team…</p>}
        {cards && cards.length === 0 && (
          <p className="dir-msg">No cards yet. Add the first one in the admin panel.</p>
        )}
        {cards &&
          cards.map((c) => (
            <Link key={c.slug} to={`/c/${c.slug}`} className="dir-card">
              <span className="dir-avatar" style={{ "--a": c.accent || "#C62727" }}>
                {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </span>
              <span className="dir-info">
                <span className="dir-name">{c.name}</span>
                <span className="dir-role">{c.title}</span>
              </span>
              <span className="dir-arrow">→</span>
            </Link>
          ))}
      </main>

      <footer className="dir-foot">
        <span>{company.address}</span>
        <span>{company.phone} · {company.email}</span>
        <Link to="/admin" className="dir-admin">Admin</Link>
      </footer>
    </div>
  );
}
