const T = window.TRANSLATIONS;
const state = { lang: localStorage.getItem('proza_lang') || 'ka' };

function t(key){
  const dict = T[state.lang] || T.ka;
  return dict[key] || (T.ka[key] || key);
}
function applyText(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    let val = t(key);
    // template replacements
    val = val.replace('{price}', window.PRICES.base).replace('{extra}', window.PRICES.extra);
    el.textContent = val;
  });
  document.documentElement.lang = state.lang;
  document.querySelectorAll('.lang button').forEach(b=>{
    b.classList.toggle('active', b.dataset.lang===state.lang);
  });
}
function setLang(l){
  state.lang = l;
  localStorage.setItem('proza_lang', l);
  applyText();
}
window.addEventListener('DOMContentLoaded', ()=>{
  // language
  document.querySelectorAll('.lang button').forEach(b=>{
    b.addEventListener('click', ()=>setLang(b.dataset.lang));
  });
  applyText();

  // gallery tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      tab.classList.add('active');
      const id = tab.dataset.target;
      document.querySelectorAll('[data-gallery]').forEach(g=>{
        g.style.display = g.dataset.gallery===id ? 'grid' : 'none';
      });
    });
  });

  // lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  const closeBtn = lb.querySelector('button');
  closeBtn.addEventListener('click', ()=>{ lb.style.display='none'; lbImg.src=''; });
  lb.addEventListener('click', (e)=>{ if(e.target===lb) closeBtn.click(); });

  document.querySelectorAll('.thumb').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      lbImg.src = btn.dataset.full;
      lb.style.display='flex';
    });
  });

  // form -> mailto
  const form = document.getElementById('requestForm');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const dates = form.elements['dates'].value.trim();
    const guests = form.elements['guests'].value.trim();
    const msg = form.elements['message'].value.trim();
    const subject = encodeURIComponent(`Booking request — PROZA`);
    const body = encodeURIComponent(`Name: ${name}\nDates: ${dates}\nGuests: ${guests}\n\nMessage:\n${msg}\n\nPhone/WhatsApp: ${window.CONTACT.phone}`);
    window.location.href = `mailto:${window.CONTACT.email}?subject=${subject}&body=${body}`;
  });
});