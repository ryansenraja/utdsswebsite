(()=>{'use strict';
const R=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let overlay=null;let overlayDelay=null;
function ensureOverlay(){if(overlay)return overlay;overlay=document.createElement('div');overlay.id='utdss-navigation-cover';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');overlay.innerHTML='<div class="utdss-navigation-inner"><span class="utdss-navigation-mark" aria-hidden="true">U</span><strong>UNITED SHIPPING SERVICES</strong><span class="utdss-navigation-message">Opening your page…</span><span class="utdss-navigation-progress" aria-hidden="true"></span></div>';document.body.append(overlay);return overlay;}
document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
const a=e.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;
let href;try{href=new URL(a.href,location.href)}catch{return;}
if(href.origin!==location.origin||!['http:','https:'].includes(href.protocol)||href.pathname===location.pathname&&href.search===location.search&&href.hash)return;
if(!/\.(html?)?$/.test(href.pathname)&&href.pathname!=='/')return;
clearTimeout(overlayDelay);overlayDelay=setTimeout(()=>{if(document.visibilityState==='visible'){const p=ensureOverlay();p.classList.add('is-visible')}},1000);
});
window.addEventListener('pageshow',()=>{clearTimeout(overlayDelay);overlay?.classList.remove('is-visible');});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(overlayDelay);overlay?.classList.remove('is-visible')}});
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


/* Quick navigation: accessible local site finder with no external requests. */
(function setupSiteFinder(){
 const header=document.querySelector('body > header');
 if(!header||document.getElementById('utdss-site-search-trigger'))return;
 const pages=[
  {title:'Home',subtitle:'Company overview',url:'/',terms:'home welcome overview'},
  {title:'About United Shipping Services',subtitle:'Our company and approach',url:'/about.html',terms:'about team who we are company'},
  {title:'Services',subtitle:'How we support sourcing requirements',url:'/services.html',terms:'service supply sourcing procurement capabilities'},
  {title:'Products and supply categories',subtitle:'Browse types of procurement enquiries',url:'/products.html',terms:'products catalogue equipment categories supply'},
  {title:'Agencies and brands',subtitle:'Explore listed brands',url:'/agencies.html',terms:'agency brand manufacturer partner reseller stockholding'},
  {title:'Maritime',subtitle:'Marine and vessel supply enquiries',url:'/maritime.html',terms:'marine vessel ship maritime nautical'},
  {title:'Defence and institutional',subtitle:'Institutional procurement enquiries',url:'/defence.html',terms:'defence defense government tender institution'},
  {title:'Energy and offshore',subtitle:'Technical sourcing for energy requirements',url:'/energy.html',terms:'energy offshore power'},
  {title:'Industrial supply',subtitle:'Industrial parts and equipment',url:'/industrial.html',terms:'industrial tools components'},
  {title:'Aviation support',subtitle:'Ground-support supply enquiries',url:'/aviation.html',terms:'aviation aircraft ground'},
  {title:'Smart Sourcing Desk',subtitle:'Prepare a structured enquiry and Outlook email',url:'/sourcing.html',terms:'rfq request quotation nsn mpn sourcing desk part number submit'},
  {title:'Contact UTDSS',subtitle:'Email and quotation information',url:'/contact.html',terms:'contact email reach representative address'}
 ];
 const trigger=document.createElement('button');
 trigger.id='utdss-site-search-trigger';trigger.type='button';trigger.className='utdss-search-trigger';
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','utdss-site-finder');trigger.setAttribute('aria-label','Search site pages');
 trigger.innerHTML='<svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="10.7" cy="10.7" r="6.8"/><path d="m16 16 5 5"/></svg><span>Search</span><kbd>/</kbd>';
 const nav=header.querySelector(':scope > nav');
 if(nav)header.append(trigger);else return;
 const backdrop=document.createElement('div');
 backdrop.id='utdss-site-finder';backdrop.className='utdss-finder-backdrop';backdrop.hidden=true;
 backdrop.innerHTML='<section class="utdss-site-finder" role="dialog" aria-modal="true" aria-labelledby="utdss-finder-title"><div class="utdss-finder-heading"><div><span>QUICK NAVIGATION</span><h2 id="utdss-finder-title">Where can we help?</h2></div><button type="button" class="utdss-finder-close" aria-label="Close site search">×</button></div><label class="utdss-finder-search"><span class="utdss-visually-hidden">Search pages, sectors and sourcing</span><input type="search" autocomplete="off" spellcheck="false" placeholder="Search sectors, products, quotation…" maxlength="100"></label><p id="utdss-finder-count" class="utdss-finder-count" role="status" aria-live="polite"></p><div id="utdss-finder-results" class="utdss-finder-results"></div><div class="utdss-finder-foot">Press Esc to close · No account required</div></section>';
 document.body.append(backdrop);
 const input=backdrop.querySelector('input');
 const results=backdrop.querySelector('#utdss-finder-results');
 const count=backdrop.querySelector('#utdss-finder-count');
 const close=backdrop.querySelector('.utdss-finder-close');
 let previousFocus=null;
 const render=()=>{
  const q=input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const matches=pages.filter(p=>{const combined=(p.title+' '+p.subtitle+' '+p.terms).toLocaleLowerCase();return q.every(x=>combined.includes(x))});
  results.replaceChildren();
  for(const p of matches){
   const a=document.createElement('a');a.href=p.url;a.className='utdss-finder-result';
   const title=document.createElement('strong');title.textContent=p.title;
   const subtitle=document.createElement('span');subtitle.textContent=p.subtitle;
   const arrow=document.createElement('span');arrow.textContent='→';arrow.setAttribute('aria-hidden','true');
   a.append(title,subtitle,arrow);results.append(a);
  }
  count.textContent=matches.length?matches.length+' matching '+(matches.length===1?'page':'pages'):'No matching pages. Try another keyword.';
 };
 const setOpen=open=>{
  if(open){
   previousFocus=document.activeElement;
   backdrop.hidden=false;document.body.classList.add('utdss-search-open');
   input.value='';render();input.focus({preventScroll:true});
  }else{
   backdrop.hidden=true;document.body.classList.remove('utdss-search-open');
   if(previousFocus&&typeof previousFocus.focus==='function')previousFocus.focus({preventScroll:true});
  }
 };
 trigger.addEventListener('click',()=>setOpen(true));
 close.addEventListener('click',()=>setOpen(false));
 backdrop.addEventListener('pointerdown',e=>{if(e.target===backdrop)setOpen(false)});
 input.addEventListener('input',render);
 input.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){const first=results.querySelector('a');if(first){e.preventDefault();first.focus()}}});
 results.addEventListener('keydown',e=>{
  const links=[...results.querySelectorAll('a')];const i=links.indexOf(document.activeElement);
  if(e.key==='ArrowDown'&&i>=0){e.preventDefault();links[Math.min(i+1,links.length-1)].focus()}
  if(e.key==='ArrowUp'&&i>=0){e.preventDefault();if(i===0)input.focus();else links[i-1].focus()}
 });
 document.addEventListener('keydown',e=>{
  const inForm=e.target.closest?.('input,textarea,select,[contenteditable="true"]');
  if((e.key==='/'&&!inForm&&!e.ctrlKey&&!e.metaKey&&!e.altKey)||(e.key.toLowerCase()==='k'&&(e.ctrlKey||e.metaKey))){
   e.preventDefault();setOpen(true);
  }
  if(backdrop.hidden)return;
  if(e.key==='Escape'){e.preventDefault();setOpen(false)}
  if(e.key==='Tab'){
   const focusable=[input,...results.querySelectorAll('a'),close];
   const active=focusable.indexOf(document.activeElement);
   if(e.shiftKey&&active===0){e.preventDefault();close.focus()}
   else if(!e.shiftKey&&document.activeElement===close){e.preventDefault();input.focus()}
  }
 });
 render();
})();

})();