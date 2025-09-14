// updates.js — Online Workshops with thumbnails and absolute links
(function () {
  const LIST_URL = "https://online.orane.com/online-workshops";
  const META_ENDPOINT = "https://script.google.com/macros/s/AKfycby88hNEmXqnZ5D6T4LDUL96elLWI-MWyJruMXHccmN4q2VP8cRotIkUA0bpBIE6rj3m/exec";

  const updatesEl = document.getElementById("updates-list");
  const updatesNote = document.getElementById("updates-note");

  const abs = (u) => new URL(u, LIST_URL).href;

  async function fetchHtml(url) {
    const prox = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
    const r = await fetch(prox, { cache: "no-store" });
    if (!r.ok) throw new Error("proxy " + r.status);
    return r.text();
  }

  function extractItems(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const base = doc.createElement("base"); base.href = LIST_URL; doc.head.appendChild(base);
    const links = [...doc.querySelectorAll("a[href]")].map(a => abs(a.getAttribute("href")));
    const onlyWorkshops = links
      .filter(u => /\/online-workshops\/[^\/?#]+\/?$/.test(u))
      .filter(u => u !== abs("/online-workshops/"));
    const uniq = [...new Set(onlyWorkshops)].slice(0, 8);
    return uniq.map(u => ({
      title: decodeURIComponent(u.split("/").filter(Boolean).pop() || "Workshop")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, m => m.toUpperCase()),
      link: u
    }));
  }

  // Get og:image via Apps Script, proxied to avoid CORS
  async function ogImage(url) {
    try {
      const u = `${META_ENDPOINT}?meta=${encodeURIComponent(url)}`;
      const prox = "https://api.allorigins.win/raw?url=" + encodeURIComponent(u);
      const r = await fetch(prox, { cache: "no-store" });
      if (!r.ok) return "";
      const j = await r.json();
      return (j && j.image) || "";
    } catch { return ""; }
  }

  (async () => {
    try {
      const html = await fetchHtml(LIST_URL);
      const items = extractItems(html);

      await Promise.all(items.map(async it => { it.image = await ogImage(it.link); }));

      updatesEl.innerHTML = "";
      items.forEach(it => {
        const el = document.createElement("article");
        el.className = "update";
        el.innerHTML = `
          <a href="${it.link}" target="_blank" rel="noopener"><strong>${it.title}</strong></a>
          ${it.image ? `<img class="thumb" src="${it.image}" alt="">` : ""}
        `;
        updatesEl.appendChild(el);
      });
      updatesNote.textContent = "";
    } catch (e) {
      console.error(e);
      updatesNote.textContent = "Couldn’t fetch updates.";
    }
  })();
})();
