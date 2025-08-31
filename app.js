// app.js — sends the form to your Google Apps Script
const ENDPOINT = "https://script.google.com/macros/s/AKfycbwSxmqgGefIpcxxndPj6ugG9wQOv0q2fd_9gSZTAhWT5RKTZQM-7qo6vltAN5F8qmlA/exec";

function v(sel) { const el = document.querySelector(sel); return el ? (el.value || "").trim() : ""; }
function setMsg(txt, ok=false) {
  const m = document.querySelector("#formMsg");
  if (!m) return;
  m.style.color = ok ? "green" : "crimson";
  m.textContent = txt;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#alumniForm");
  const btn = document.querySelector("#submitBtn");
  if (!form) return; // page has no form, nothing to do

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (btn) btn.disabled = true;
    setMsg("Submitting...", true);

    if (!v("#email") && !v("#whatsapp")) {
      if (btn) btn.disabled = false;
      return setMsg("Provide at least email or WhatsApp.");
    }

    // Use form-encoded to dodge browser CORS preflight
    const payload = new URLSearchParams({
      first_name: v("#first_name"),
      last_name: v("#last_name"),
      email: v("#email"),
      whatsapp: v("#whatsapp"),
      city: v("#city"),
      country: v("#country"),
      graduating_year: v("#graduating_year"),
      instagram: v("#instagram"),
      facebook: v("#facebook"),
      snapchat: v("#snapchat"),
      occupation: v("#occupation"),
      user_agent: navigator.userAgent
    });

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: payload.toString()
      });
      const data = await res.json();
      if (data.ok) {
        form.reset();
        setMsg("Thanks! Your details were saved.", true);
      } else {
        setMsg("Could not save: " + (data.error || "Unknown error"));
      }
    } catch {
      setMsg("Network error. Try again.");
    } finally {
      if (btn) btn.disabled = false;
    }
  });
});
