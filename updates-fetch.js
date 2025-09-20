(function(){
  const updatesEl = document.getElementById('updates-list');
  const updatesNote = document.getElementById('updates-note');

  fetch('/.netlify/functions/learnworlds-updates',{cache:'no-store'})
    .then(r=>r.json())
    .then(j=>{
      if(!j.ok || !Array.isArray(j.items) || !j.items.length) throw new Error('No items');
      updatesEl.innerHTML='';
      j.items.forEach(it=>{
        const d = it.date ? new Date(it.date) : null;
        const time = d ? `<time datetime="${d.toISOString()}">${d.toLocaleDateString()}</time>` : '';
        const img  = it.image ? `<img class="thumb" src="${it.image}" alt="">` : '';
        const el = document.createElement('article');
        el.className='update';
        el.innerHTML = `${time}<a href="${it.link}" target="_blank" rel="noopener"><strong>${it.title}</strong></a>${img}`;
        updatesEl.appendChild(el);
      });
      updatesNote.textContent='';
    })
    .catch(e=>{ 
      console.warn('Updates fetch error:', e); 
      updatesNote.textContent="Couldn't fetch updates. Please try again later."; 
      updatesEl.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">Updates temporarily unavailable</p>';
    });
})();