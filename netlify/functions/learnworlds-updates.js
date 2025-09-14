const ORIGIN = "https://online.orane.com";
const SITEMAP = ORIGIN + "/sitemap.xml";

const pick = (s, re) => (s.match(re) || [,""])[1] || "";
const titleFromSlug = (u) =>
  decodeURIComponent(u.split("/").filter(Boolean).pop() || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, m => m.toUpperCase());

exports.handler = async () => {
  try {
    const xml = await fetch(SITEMAP, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.text());
    const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m => m[1]);
    let items = urls.map(block => {
      const loc = pick(block, /<loc>([^<]+)<\/loc>/);
      const lastmod = pick(block, /<lastmod>([^<]+)<\/lastmod>/);
      return { loc, lastmod };
    }).filter(x =>
      x.loc && /\/course\//.test(x.loc) && !/\/store\/?$/.test(x.loc)
    );
    items.sort((a,b) => new Date(b.lastmod||0) - new Date(a.lastmod||0));
    items = items.slice(0, 8);

    const enriched = await Promise.all(items.map(async it => {
      let image = "";
      try {
        const html = await fetch(it.loc, { headers: { "User-Agent": "Mozilla/5.0" } }).then(r => r.text());
        image =
          pick(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
          pick(html, /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) || "";
      } catch {}
      return { title: titleFromSlug(it.loc), link: it.loc, date: it.lastmod || "", image };
    }));

    return { statusCode: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ ok: true, items: enriched }) };
  } catch (e) {
    return { statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(e) }) };
  }
};
