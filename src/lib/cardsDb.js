// All card data access goes through here.
// Cards are stored in RTDB under /cards/<slug>. The slug is the key AND the URL.

import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, set, remove, get } from "firebase/database";

export const company = {
  name: "New Shield Insurance Brokers",
  short: "NSIB",
  tagline: "Your Insurance Channel Partner",
  website: "https://nsib.ae",
  address: "One by Omniyat, Suite 2801, Al Mustaqbal St, Business Bay, Dubai, UAE",
  phone: "+971 4 705 8000",
  email: "enquiry@nsib.ae",
};

// The shape of a card. Used to seed the "new card" form.
export const emptyCard = {
  slug: "",
  name: "",
  title: "",
  department: "",
  phone: "+971 4 705 8000",
  mobile: "",
  email: "",
  whatsapp: "",
  linkedin: "",
  website: "https://nsib.ae",
  location: "Business Bay, Dubai, UAE",
  accent: "",
};

// Realtime list of all cards (array), sorted by name. Live-updates on any change.
export function useCards() {
  const [cards, setCards] = useState(null); // null = loading
  const [error, setError] = useState(null);
  useEffect(() => {
    const cardsRef = ref(db, "cards");
    const unsub = onValue(
      cardsRef,
      (snap) => {
        const val = snap.val() || {};
        const list = Object.entries(val).map(([slug, c]) => ({ ...c, slug }));
        list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        setCards(list);
      },
      (err) => setError(err.message)
    );
    return () => unsub();
  }, []);
  return { cards, error };
}

// Realtime single card by slug.
export function useCard(slug) {
  const [card, setCard] = useState(undefined); // undefined = loading, null = not found
  useEffect(() => {
    if (!slug) return;
    const cardRef = ref(db, `cards/${slug}`);
    const unsub = onValue(cardRef, (snap) => {
      setCard(snap.exists() ? { ...snap.val(), slug } : null);
    });
    return () => unsub();
  }, [slug]);
  return card;
}

// Save (create or overwrite) a card. Strips the slug out of the stored value.
export async function saveCard(card) {
  const { slug, ...rest } = card;
  const clean = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== "" && v != null)
  );
  await set(ref(db, `cards/${slug}`), clean);
}

// Delete a card by slug.
export async function deleteCard(slug) {
  await remove(ref(db, `cards/${slug}`));
}

// One-time check whether a slug already exists (used to warn on rename/collision).
export async function slugExists(slug) {
  const snap = await get(ref(db, `cards/${slug}`));
  return snap.exists();
}
