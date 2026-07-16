import { useState } from "react";
import { Link } from "react-router-dom";
import { useCards, saveCard, deleteCard, slugExists, emptyCard } from "../lib/cardsDb";
import { useAuth, logout } from "../lib/auth";
import "./Admin.css";

const FIELDS = [
  { key: "name", label: "Full name", required: true },
  { key: "title", label: "Job title", required: true },
  { key: "department", label: "Department" },
  { key: "mobile", label: "Mobile" },
  { key: "phone", label: "Office phone" },
  { key: "email", label: "Email", type: "email" },
  { key: "whatsapp", label: "WhatsApp number (digits only)" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "website", label: "Website" },
  { key: "location", label: "Location" },
  { key: "accent", label: "Accent colour (hex, optional)", placeholder: "#C62727" },
];

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function Admin() {
  const { cards, error } = useCards();
  const user = useAuth();
  const [editing, setEditing] = useState(null); // card object or null
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function startNew() {
    setEditing({ ...emptyCard });
    setIsNew(true);
    setMsg("");
  }

  function startEdit(card) {
    setEditing({ ...emptyCard, ...card });
    setIsNew(false);
    setMsg("");
  }

  function field(key, value) {
    setEditing((c) => {
      const next = { ...c, [key]: value };
      // auto-fill slug from name only while creating and slug untouched
      if (isNew && key === "name") next.slug = slugify(value);
      return next;
    });
  }

  async function onSave(e) {
    e.preventDefault();
    if (!editing.name || !editing.title) {
      setMsg("Name and title are required.");
      return;
    }
    const slug = editing.slug || slugify(editing.name);
    if (!slug) { setMsg("Could not build a URL from that name."); return; }
    setSaving(true);
    try {
      if (isNew && (await slugExists(slug))) {
        setMsg(`A card already exists at /c/${slug}. Change the name or URL.`);
        setSaving(false);
        return;
      }
      await saveCard({ ...editing, slug });
      setMsg(`Saved. Card is live at /c/${slug}`);
      setEditing(null);
    } catch (err) {
      setMsg(`Save failed: ${err.message}`);
    }
    setSaving(false);
  }

  async function onDelete(slug) {
    if (!confirm(`Delete the card at /c/${slug}? This cannot be undone.`)) return;
    try {
      await deleteCard(slug);
      setMsg(`Deleted /c/${slug}`);
      if (editing?.slug === slug) setEditing(null);
    } catch (err) {
      setMsg(`Delete failed: ${err.message}`);
    }
  }

  return (
    <div className="admin">
      <header className="admin-head">
        <div>
          <h1>Card admin</h1>
          <Link to="/" className="admin-back">← View directory</Link>
        </div>
        <div className="admin-head-right">
          {user && <span className="admin-user">{user.email}</span>}
          <button className="btn primary" onClick={startNew}>+ New card</button>
          <button className="btn ghost" onClick={() => logout()}>Sign out</button>
        </div>
      </header>

      {msg && <p className="admin-msg">{msg}</p>}
      {error && <p className="admin-msg error">Database error: {error}</p>}

      <div className="admin-body">
        <ul className="admin-list">
          {cards === null && <li className="admin-empty">Loading…</li>}
          {cards && cards.length === 0 && <li className="admin-empty">No cards yet.</li>}
          {cards &&
            cards.map((c) => (
              <li key={c.slug} className={editing?.slug === c.slug && !isNew ? "row active" : "row"}>
                <button className="row-main" onClick={() => startEdit(c)}>
                  <span className="row-name">{c.name}</span>
                  <span className="row-slug">/c/{c.slug} · {c.title}</span>
                </button>
                <div className="row-tools">
                  <a href={`/c/${c.slug}`} target="_blank" rel="noreferrer" className="mini">Open</a>
                  <button className="mini danger" onClick={() => onDelete(c.slug)}>Delete</button>
                </div>
              </li>
            ))}
        </ul>

        {editing && (
          <form className="admin-form" onSubmit={onSave}>
            <h2>{isNew ? "New card" : `Editing ${editing.name}`}</h2>

            <label className="fld">
              <span>Card URL{isNew ? " (auto from name, editable)" : " (fixed)"}</span>
              <div className="slug-line">
                <em>/c/</em>
                <input
                  value={editing.slug}
                  onChange={(e) => field("slug", slugify(e.target.value))}
                  disabled={!isNew}
                  placeholder="kiran"
                />
              </div>
            </label>

            {FIELDS.map((f) => (
              <label className="fld" key={f.key}>
                <span>{f.label}{f.required ? " *" : ""}</span>
                <input
                  type={f.type || "text"}
                  value={editing[f.key] || ""}
                  placeholder={f.placeholder || ""}
                  onChange={(e) => field(f.key, e.target.value)}
                />
              </label>
            ))}

            <div className="form-actions">
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? "Saving…" : "Save card"}
              </button>
              <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
