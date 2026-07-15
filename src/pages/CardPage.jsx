import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useCard, company } from "../lib/cardsDb";
import { downloadVCard } from "../lib/vcard";
import "./CardPage.css";

export default function CardPage() {
  const { slug } = useParams();
  const card = useCard(slug);
  const [nfcStatus, setNfcStatus] = useState("");
  const [shareMsg, setShareMsg] = useState("");
  const [showQR, setShowQR] = useState(false);

  const cardUrl = useMemo(
    () => `${window.location.origin}/c/${slug}`,
    [slug]
  );

  if (card === undefined) {
    return (
      <div className="empty">
        <img src="/nsib-crest.png" alt="NSIB" width="72" />
        <p>Loading…</p>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="empty">
        <img src="/nsib-crest.png" alt="NSIB" width="88" />
        <h1>Card not found</h1>
        <p>No card exists at this address.</p>
        <Link className="btn ghost" to="/">Back to directory</Link>
      </div>
    );
  }

  const accent = card.accent || "#C62727";
  const isAdmin = sessionStorage.getItem("nsib_admin_ok") === "1";

  async function writeNfc() {
    if (!("NDEFReader" in window)) {
      setNfcStatus("NFC writing needs Chrome on Android. Use the QR code instead.");
      return;
    }
    try {
      setNfcStatus("Hold an NFC tag to the back of your phone…");
      const ndef = new window.NDEFReader();
      await ndef.write({ records: [{ recordType: "url", data: cardUrl }] });
      setNfcStatus("Tag written. It now opens this card on tap.");
    } catch (err) {
      setNfcStatus(`Could not write tag: ${err.message}`);
    }
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${card.name} — ${company.short}`, url: cardUrl });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(cardUrl);
      setShareMsg("Link copied to clipboard.");
      setTimeout(() => setShareMsg(""), 2500);
    }
  }

  return (
    <div className="card-wrap">
      <div className="card" style={{ "--accent": accent }}>
        <div className="card-hero">
          <img className="hero-crest" src="/nsib-crest.png" alt="NSIB — Your Insurance Channel Partner" />
          <div className="hero-company">
            <span className="hero-name">NEW SHIELD</span>
            <span className="hero-sub">Insurance Brokers L.L.C.</span>
          </div>
        </div>

        <div className="card-body">
          <div className="avatar" aria-hidden="true">
            {card.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <h1 className="name">{card.name}</h1>
          <p className="title">{card.title}</p>
          {card.department && <p className="dept">{card.department}</p>}

          <div className="actions">
            <button className="btn primary" onClick={() => downloadVCard(card, company)}>
              Save contact
            </button>
            <button className="btn ghost" onClick={shareCard}>Share</button>
          </div>

          {shareMsg && <p className="share-msg">{shareMsg}</p>}

          <ul className="rows">
            {card.mobile && <Row label="Mobile" value={card.mobile} href={`tel:${card.mobile}`} />}
            {card.phone && <Row label="Office" value={card.phone} href={`tel:${card.phone}`} />}
            {card.email && <Row label="Email" value={card.email} href={`mailto:${card.email}`} />}
            {card.whatsapp && (
              <Row label="WhatsApp" value="Message" href={`https://wa.me/${card.whatsapp.replace(/\D/g, "")}`} />
            )}
            {card.linkedin && <Row label="LinkedIn" value="View profile" href={card.linkedin} />}
            {card.website && <Row label="Website" value={card.website.replace(/^https?:\/\//, "")} href={card.website} />}
            {card.location && <Row label="Location" value={card.location} />}
          </ul>

          {isAdmin && (
            <>
              <div className="share-tools">
                <button className="tool" onClick={() => setShowQR((v) => !v)}>
                  {showQR ? "Hide QR code" : "Show QR code"}
                </button>
                <button className="tool" onClick={writeNfc}>Write to NFC tag</button>
              </div>

              {showQR && (
                <div className="qr">
                  <QRCodeCanvas value={cardUrl} size={168} fgColor="#0A1F3C" level="M" includeMargin />
                  <span>Scan to open this card</span>
                </div>
              )}

              {nfcStatus && <p className="nfc-status">{nfcStatus}</p>}
            </>
          )}
        </div>

        <div className="card-foot">
          <span>{company.name}</span>
          <a href={company.website}>{company.website.replace(/^https?:\/\//, "")}</a>
        </div>
      </div>

      <Link className="back-link" to="/">← Team directory</Link>
    </div>
  );
}

function Row({ label, value, href }) {
  const content = (
    <>
      <span className="row-label">{label}</span>
      <span className="row-value">{value}</span>
    </>
  );
  return (
    <li className="row">
      {href ? <a href={href} target="_blank" rel="noreferrer">{content}</a> : content}
    </li>
  );
}
