(()=>{'use strict';
const R=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let overlay=null;
function ensureOverlay(){if(overlay)return overlay;overlay=document.createElement('div');overlay.id='utdss-navigation-cover';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');overlay.innerHTML='<div class="utdss-navigation-inner"><span class="utdss-navigation-mark" aria-hidden="true">U</span><strong>UNITED SHIPPING SERVICES</strong><span class="utdss-navigation-message">Opening your page…</span><span class="utdss-navigation-progress" aria-hidden="true"></span></div>';document.body.append(overlay);return overlay;}
document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
const a=e.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;
let href;try{href=new URL(a.href,location.href)}catch{return;}
if(href.origin!==location.origin||!['http:','https:'].includes(href.protocol)||href.pathname===location.pathname&&href.search===location.search&&href.hash)return;
if(!/\.(html?)?$/.test(href.pathname)&&href.pathname!=='/')return;
const p=ensureOverlay();p.classList.add('is-visible');
},{capture:true});
window.addEventListener('pageshow',()=>{overlay?.classList.remove('is-visible');});
const video=document.querySelector('#utdssPromotionalVideo');
if(video){let status=document.getElementById('filmLoadNotice');if(status){
const show=(str)=>{status.textContent=str;status.classList.add('is-visible');};
const hide=()=>status.classList.remove('is-visible');
video.addEventListener('waiting',()=>show('Preparing the HD video…'));
video.addEventListener('stalled',()=>show('Connection is slow. Video is buffering…'));
video.addEventListener('playing',hide);
video.addEventListener('canplay',hide);
video.addEventListener('error',()=>show('Video unavailable right now. Please try again.'));
}}

/* Accessible, space-efficient mobile navigation on every page. */
const primaryHeader=document.querySelector('body > header');
const primaryNav=primaryHeader?.querySelector(':scope > nav');
if(primaryHeader&&primaryNav&&!primaryHeader.querySelector('.utdss-menu-toggle')){
  if(!primaryNav.id)primaryNav.id='utdss-primary-menu';
  const menu=document.createElement('button');
  menu.type='button';menu.className='utdss-menu-toggle';
  menu.setAttribute('aria-controls',primaryNav.id);
  menu.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-label','Open navigation menu');
  menu.innerHTML='<span class="utdss-menu-bars" aria-hidden="true"><i></i><i></i><i></i></span><span class="utdss-menu-caption">Menu</span>';
  primaryHeader.insertBefore(menu,primaryNav);
  const localise=t=>window.UTDSSLocaleText?window.UTDSSLocaleText(t):t;
  const setOpen=open=>{
    primaryHeader.classList.toggle('utdss-menu-open',open);
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',localise(open?'Close navigation menu':'Open navigation menu'));
    const title=menu.querySelector('.utdss-menu-caption');
    if(title)title.textContent=localise(open?'Close menu':'Menu');
  };
  setOpen(false);
  document.addEventListener('utdss:languagechange',()=>setOpen(menu.getAttribute('aria-expanded')==='true'));
  menu.addEventListener('click',()=>setOpen(menu.getAttribute('aria-expanded')!=='true'));
  primaryNav.addEventListener('click',e=>{if(e.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setOpen(false);menu.focus()}});
  document.addEventListener('click',e=>{if(menu.getAttribute('aria-expanded')==='true'&&!primaryHeader.contains(e.target))setOpen(false)});
}

})();