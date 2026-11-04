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
});
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
  primaryNav.addEventListener('click',e=>{if(!e.defaultPrevented&&e.target.closest('a'))setOpen(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setOpen(false);menu.focus()}});
  document.addEventListener('click',e=>{if(menu.getAttribute('aria-expanded')==='true'&&!primaryHeader.contains(e.target))setOpen(false)});
}


/* Understated header navigation: no arrows, icons, ticks or extra controls. */
if(primaryHeader&&primaryNav&&!primaryNav.dataset.utdssDropdowns){
 primaryNav.dataset.utdssDropdowns='ready';
 const definitions={
  '/about.html':[['Our company','/about.html'],['Our approach','/about.html#about-approach'],['Sectors','/about.html#about-sectors']],
  '/services.html':[['All services','/services.html'],['Maritime','/maritime.html'],['Defence & Institutional','/defence.html'],['Energy & Offshore','/energy.html'],['Industrial','/industrial.html'],['Aviation Support','/aviation.html']],
  '/products.html':[['Supply categories','/products.html'],['Smart Sourcing Desk','/sourcing.html']],
  '/agencies.html':[['Brands & supply enquiries','/agencies.html'],['Ask about a brand','/sourcing.html']],
  '/contact.html':[['Contact details','/contact.html'],['Request a Quotation','/#quote']],
  '#sectors':[['Maritime','/maritime.html'],['Defence & Institutional','/defence.html'],['Energy & Offshore','/energy.html'],['Industrial','/industrial.html'],['Aviation Support','/aviation.html']]
 };
 const menus=[];let number=0;
 const translate=t=>window.UTDSSLocaleText?window.UTDSSLocaleText(t):t;
 const closeOthers=current=>menus.forEach(m=>{if(m!==current)m.close()});
 for(const link of [...primaryNav.children]){
   if(link.tagName!=='A')continue;
   const raw=link.getAttribute('href')||'';
   const key=raw==='#sectors'?'#sectors':new URL(link.href,location.href).pathname;
   const entries=definitions[key];
   if(!entries)continue;
   const wrapper=document.createElement('div');wrapper.className='utdss-nav-item';
   const id='utdss-nav-panel-'+(++number);
   const dropdown=document.createElement('div');dropdown.className='utdss-nav-dropdown';dropdown.id=id;
   dropdown.setAttribute('aria-hidden','true');
   entries.forEach(([label,href],index)=>{
     const a=document.createElement('a');a.href=href;a.dataset.originalText=label;
     a.style.setProperty('--utdss-nav-seq',String(Math.min(index,5)));
     a.textContent=translate(label);a.tabIndex=-1;dropdown.append(a);
   });
   link.parentNode.insertBefore(wrapper,link);
   wrapper.append(link,dropdown);
   link.setAttribute('aria-haspopup','true');
   link.setAttribute('aria-controls',id);
   let closeTimer=null;
   const setOpen=open=>{
     if(closeTimer!==null){clearTimeout(closeTimer);closeTimer=null;}
     wrapper.classList.toggle('is-open',open);
     link.setAttribute('aria-expanded',String(open));
     dropdown.setAttribute('aria-hidden',String(!open));
     dropdown.querySelectorAll('a').forEach(a=>a.tabIndex=open?0:-1);
   };
   const entry={wrapper,close:()=>setOpen(false)};menus.push(entry);
   setOpen(false);
   const desktop=()=>matchMedia('(hover:hover) and (pointer:fine) and (min-width:781px)').matches;
   wrapper.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'&&desktop()){closeOthers(entry);setOpen(true)}});
   wrapper.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&desktop())closeTimer=setTimeout(()=>{if(!wrapper.contains(document.activeElement))setOpen(false)},130)});
   wrapper.addEventListener('focusin',()=>{closeOthers(entry);setOpen(true)});
   wrapper.addEventListener('focusout',e=>{if(!wrapper.contains(e.relatedTarget))setOpen(false)});
   // On touch / compact navigation, the first tap reveals the links.
   // A second tap on the heading follows its original destination.
   link.addEventListener('click',e=>{
     if(!desktop()&&!wrapper.classList.contains('is-open')){
       e.preventDefault();closeOthers(entry);setOpen(true);
     }
   });
   wrapper.addEventListener('keydown',e=>{
     if(e.key==='Escape'){e.preventDefault();setOpen(false);link.focus();}
     if(e.key==='ArrowDown'&&e.target===link){e.preventDefault();closeOthers(entry);setOpen(true);dropdown.querySelector('a')?.focus();}
   });
   document.addEventListener('utdss:languagechange',()=>{
     dropdown.querySelectorAll('a').forEach(a=>a.textContent=translate(a.dataset.originalText));
   });
 }
 document.addEventListener('pointerdown',e=>{
   if(!primaryNav.contains(e.target))menus.forEach(m=>m.close());
 },{passive:true});
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape')menus.forEach(m=>m.close());
 });
}

})();