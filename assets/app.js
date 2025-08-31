const form = document.getElementById('signup');
const msg = document.getElementById('msg');
const feedEl = document.getElementById('feed');
const btn = document.getElementById('btn');

function toJSONSafe(res){
  return res.text().then(t => {
    try { return JSON.parse(t); } catch(e) {
      throw new Error('Non-JSON response from API. Check API_URL. First chars: ' + t.slice(0,30));
    }
  });
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!window.API_URL) { msg.textContent = 'API URL missing.'; return; }

  const wa = form.whatsapp?.value?.trim();
  if (wa && !/^\+?[0-9]{8,15}$/.test(wa)) {
    msg.textContent = 'Enter WhatsApp number with country code, digits only.';
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  msg.textContent = 'Saving...';
  btn.disabled = true;

  try {
    const res = await fetch(window.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await toJSONSafe(res);
    if (!json.ok) throw new Error(json.error || 'Failed');
    msg.textContent = 'Saved! We’ll be in touch.';
    form.reset();
  } catch (err) {
    msg.textContent = 'Could not save. ' + err.message;
  } finally {
    btn.disabled = false;
  }
});

(async function loadFeed(){
  if (!feedEl || !window.API_URL) return;
  try {
    const res = await fetch(window.API_URL + '?feed=updates');
    const json = await toJSONSafe(res);
    const updates = json.updates || [];
    if (!json.ok || updates.length === 0) { feedEl.innerHTML = '<li>No updates yet.</li>'; return; }
    feedEl.innerHTML = updates.map(u =>
      `<li><strong>${u.title||'Update'}</strong> (${new Date(u.publishedAt).toLocaleDateString()})<br>${u.summary||''}</li>`
    ).join('');
  } catch {
    feedEl.innerHTML = '<li>No updates yet.</li>';
  }
})();
