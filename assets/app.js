// Legacy form handling - now handled in index.html
// This file is kept for compatibility but main form logic is in index.html

// Utility functions for other pages that might use this
function toJSONSafe(res){
  return res.text().then(t => {
    try { return JSON.parse(t); } catch(e) {
      throw new Error('Non-JSON response from API. Check API_URL. First chars: ' + t.slice(0,30));
    }
  });
}

// ---- Latest Updates (from updates.json) ----
async function loadUpdates(){
  const list = document.querySelector("#updatesList");
  if (!list) return;
  try {
    const res = await fetch("updates.json?v=1");
    const items = await res.json();
    list.innerHTML = "";
    items.slice(0,6).forEach(it => {
      const li = document.createElement("li");
      const date = it.date ? new Date(it.date).toLocaleDateString() : "";
      const title = it.url
        ? `<a href="${it.url}" target="_blank" rel="noopener">${escapeHtml(it.title)}</a>`
        : escapeHtml(it.title);
      li.innerHTML = `<span style="color:#64748b">${date}</span> ${title}${
        it.summary ? ` — ${escapeHtml(it.summary)}` : ""
      }`;
      list.appendChild(li);
    });
  } catch {}
}

function escapeHtml(s){
  return String(s||"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

document.addEventListener("DOMContentLoaded", loadUpdates);