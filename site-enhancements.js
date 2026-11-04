(()=>{'use strict';
const main=document.querySelector('main');if(main&&!main.id)main.id='main-content';
const skip=document.createElement('a');skip.className='utdss-skip';skip.href='#main-content';skip.textContent='Skip to main content';document.body.prepend(skip);
const pathname=location.pathname==='/'?'/':location.pathname.replace(/\/$/,'');document.querySelectorAll('header nav a').forEach(link=>{try{const url=new URL(link.getAttribute('href'),location.origin);if(url.pathname===pathname&&(!url.hash||pathname!=='/'))link.setAttribute('aria-current','page')}catch{}});
// Make the guided sourcing desk discoverable from every page.
const nav=document.querySelector('header nav');
if(nav&&!nav.querySelector('a[href="/sourcing.html"]')){const link=document.createElement('a');link.href='/sourcing.html';link.textContent='Smart Sourcing Desk';const quoteLink=[...nav.querySelectorAll('a')].find(a=>a.getAttribute('href')?.includes('quote'));if(quoteLink)nav.insertBefore(link,quoteLink);else nav.append(link);}
if(nav){nav.querySelectorAll('a[href]').forEach(link=>{try{const u=new URL(link.href,location.origin);if(u.pathname===location.pathname&&(!u.hash||location.pathname!=='/'))link.setAttribute('aria-current','page');}catch{}});}
document.querySelectorAll('img').forEach((img,i)=>{if(!img.hasAttribute('loading')&&i>2)img.loading='lazy';img.decoding='async';if(!img.hasAttribute('alt'))img.alt='Illustrative UTDSS sector imagery';});
document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');
const quote=document.querySelector('.quote');const table=quote?.querySelector('table');if(table&&!table.closest('.quote-scroll')){const wrapper=document.createElement('div');wrapper.className='quote-scroll';wrapper.setAttribute('role','region');wrapper.setAttribute('aria-label','Quotation item details, scroll horizontally on small screens');wrapper.tabIndex=0;table.parentElement.insertBefore(wrapper,table);wrapper.append(table);const note=document.createElement('p');note.className='quote-helper';note.textContent='Add several products using Add Row. On smaller screens, scroll the item table sideways to view all fields.';wrapper.insertAdjacentElement('afterend',note)}
const back=document.createElement('button');back.type='button';back.className='utdss-backtop';back.setAttribute('aria-label','Back to top');back.textContent='↑ Back to top';back.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));document.body.append(back);
let pending=false;function updateTop(){back.classList.toggle('is-visible',scrollY>550);pending=false}addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateTop)}},{passive:true});updateTop();
const footer=document.querySelector('footer');if(footer){const note=document.createElement('section');note.className='utdss-service-note';note.setAttribute('aria-label','Talk to our sourcing team');note.innerHTML='<div class="utdss-service-note-inner"><div><strong>Have a difficult sourcing requirement?</strong><p>Share the product description, NSN or MPN if available, quantity and destination. Our team will review feasibility and confirm commercial details before any commitment.</p></div><a href="/#quote">Request a quotation →</a></div>';footer.parentElement.insertBefore(note,footer)}
const film=document.querySelector('#utdssPromotionalVideo');if(film){film.setAttribute('aria-label','UTDSS promotional video with original piano instrumental and no narration');film.setAttribute('preload','none');}
/* Consistent practical help on secondary pages. Full assistant stays on homepage. */
if(!document.getElementById('assistant')&&!document.getElementById('utdssHelpDock')){
  const dock=document.createElement('div');dock.id='utdssHelpDock';dock.className='utdss-help-dock';
  dock.innerHTML='<button id="utdssHelpOpen" type="button" class="utdss-help-launch" aria-controls="utdssHelpPanel" aria-expanded="false">✧ Sourcing help</button><section id="utdssHelpPanel" class="utdss-help-panel" aria-label="UTDSS sourcing guidance" hidden><header><strong>UTDSS · Sourcing Help</strong><button id="utdssHelpClose" type="button" aria-label="Close sourcing help">×</button></header><p>Practical guidance only. Prices, stock and delivery must be confirmed by the UTDSS team.</p><div class="utdss-help-questions"><button type="button" data-help="prepare">How do I request a quotation?</button><button type="button" data-help="parts">What are NSN and MPN?</button><button type="button" data-help="delivery">How do I check delivery?</button><button type="button" data-help="files">How do I send drawings?</button></div><div id="utdssHelpAnswer" class="utdss-help-answer" role="status" aria-live="polite">Choose a topic to see the guidance.</div><div class="utdss-help-links"><a href="/sourcing.html">Prepare an enquiry →</a><a href="mailto:Utdss@singnet.com">Email UTDSS</a></div></section>';
  document.body.append(dock);
  const panel=dock.querySelector('#utdssHelpPanel'),open=dock.querySelector('#utdssHelpOpen'),close=dock.querySelector('#utdssHelpClose');
  const toggle=flag=>{const active=typeof flag==='boolean'?flag:panel.hidden;panel.hidden=!active;open.setAttribute('aria-expanded',String(active));if(active)close.focus();else open.focus();};
  open.addEventListener('click',()=>toggle());close.addEventListener('click',()=>toggle(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)toggle(false);});
  const responses={
    prepare:'Use the Smart Sourcing Desk to prepare the product description, quantity, manufacturer or model, part numbers and delivery requirements. Review your email in Outlook and click Send. This website does not automatically submit enquiries.',
    parts:'NSN means National Stock Number and MPN means Manufacturer Part Number. Include whichever is available, plus the product description and specifications. The website does not validate part numbers against supplier catalogues.',
    delivery:'Include the delivery destination, preferred date, product quantities and any special requirements. Delivery availability and lead time require confirmation from the UTDSS team.',
    files:'Attach product photographs, drawings, datasheets or certificates yourself in Outlook or your email app before sending the prepared enquiry to Utdss@singnet.com.'
  };
  const localise=t=>window.UTDSSLocaleText?window.UTDSSLocaleText(t):t;
  let activeTopic=null;
  dock.querySelectorAll('[data-help]').forEach(button=>button.addEventListener('click',()=>{activeTopic=button.dataset.help;dock.querySelector('#utdssHelpAnswer').textContent=localise(responses[activeTopic]||'Please contact UTDSS for assistance.');}));
  document.addEventListener('utdss:languagechange',()=>{if(activeTopic)dock.querySelector('#utdssHelpAnswer').textContent=localise(responses[activeTopic]);});
}


/* Progressive motion: enhance only when supported and enabled. Never hide content without JS. */
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduceMotion.matches&&'IntersectionObserver' in window){
  const targets=[...new Set([
    ...document.querySelectorAll('.utdss-editorial [data-ed-reveal]'),
    ...document.querySelectorAll('.utdss-secondary-main > .grid > .card, .utdss-secondary-main > .utdss-secondary-cta, .utdss-secondary-main > .choose-journey'),
    ...document.querySelectorAll('.hero-area .hero-words, .hero-area .features .feature, main .sector, .desk-promo-inner > *, .film-video-block, .lower > section, .lower > div')
  ])].filter(el=>!el.closest('[hidden],.assistant,.utdss-help-dock'));
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting){
        entry.target.classList.add('utdss-revealed','ed-visible');
        observer.unobserve(entry.target);
      }
    }
  },{threshold:0.06,rootMargin:'0px 0px 70px 0px'});
  targets.forEach((el,i)=>{
    el.classList.add('utdss-reveal');
    el.style.setProperty('--utdss-stagger',String(Math.min(i%4,3)));
    observer.observe(el);
  });
  document.documentElement.classList.add('utdss-motion-ready');
  if(document.querySelector('.utdss-editorial'))document.querySelector('.utdss-editorial').classList.add('ed-motion');
}
/* A non-interactive scroll position indicator: compositor-friendly, no misleading loading animation. */
if(!reduceMotion.matches&&document.querySelector('main')){
  const line=document.createElement('div');
  line.className='utdss-scroll-progress';
  line.setAttribute('aria-hidden','true');
  document.body.append(line);
  let scheduled=false;
  const measure=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const ratio=max>0?Math.min(1,Math.max(0,window.scrollY/max)):0;
    line.style.transform='scaleX('+ratio.toFixed(4)+')';
    scheduled=false;
  };
  const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(measure)}};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  measure();
}


/* Sector discovery: a downward-opening, accessible menu on desktop and touch devices. */
const sectorMenuData={
  '/defence.html':{name:'Defence & Institutional',description:'General institutional and non-restricted procurement enquiries.',options:[['Explore sector','/defence.html'],['Supply categories','/products.html'],['Prepare an enquiry','/sourcing.html']]},
  '/maritime.html':{name:'Maritime',description:'Vessel, deck, maintenance and marine technical supply enquiries.',options:[['Explore sector','/maritime.html'],['Supply categories','/products.html'],['Prepare an enquiry','/sourcing.html']]},
  '/energy.html':{name:'Energy & Offshore',description:'Operational, industrial and offshore sourcing requirements.',options:[['Explore sector','/energy.html'],['Supply categories','/products.html'],['Prepare an enquiry','/sourcing.html']]},
  '/industrial.html':{name:'Industrial Supply',description:'Engineering components, facility items and MRO sourcing.',options:[['Explore sector','/industrial.html'],['Supply categories','/products.html'],['Prepare an enquiry','/sourcing.html']]},
  '/aviation.html':{name:'Aviation Support',description:'General ground operations and non-flight-critical supply requests.',options:[['Explore sector','/aviation.html'],['Supply categories','/products.html'],['Prepare an enquiry','/sourcing.html']]}
};
let sectorMenuCount=0;
function enhanceSectorTile(container,sectorHref){
  const definition=sectorMenuData[sectorHref];
  if(!definition||container.dataset.utdssMenuReady)return;
  container.dataset.utdssMenuReady='true';
  container.classList.add('utdss-sector-menu');
  const id='utdss-sector-options-'+(++sectorMenuCount);
  const trigger=document.createElement('button');
  trigger.type='button';trigger.className='utdss-sector-trigger';
  trigger.setAttribute('aria-controls',id);
  trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-label','Show options for '+definition.name);
  const chevron=document.createElement('span');
  chevron.className='utdss-sector-chevron';chevron.setAttribute('aria-hidden','true');chevron.textContent='⌄';
  const text=document.createElement('span');text.textContent='Explore options';
  trigger.append(text,chevron);
  const panel=document.createElement('div');panel.id=id;panel.className='utdss-sector-dropdown';
  panel.setAttribute('aria-label',definition.name+' options');
  const description=document.createElement('p');description.className='utdss-sector-description';description.textContent=definition.description;
  const options=document.createElement('div');options.className='utdss-sector-links';
  definition.options.forEach(([label,url])=>{
    const a=document.createElement('a');a.href=url;a.textContent=label;
    a.setAttribute('tabindex','-1');options.append(a);
  });
  const selectorWrap=document.createElement('div');selectorWrap.className='utdss-sector-select-wrap';
  const selectorLabel=document.createElement('label');selectorLabel.className='utdss-sector-select-label';
  selectorLabel.htmlFor='utdss-sector-select-'+sectorMenuCount;
  selectorLabel.textContent='Select an option';
  const select=document.createElement('select');select.id=selectorLabel.htmlFor;select.className='utdss-sector-select';
  const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent='Choose where to go';select.append(placeholder);
  definition.options.forEach(([label,url])=>{
    const item=document.createElement('option');item.value=url;item.textContent=label;select.append(item);
  });
  const selectGo=document.createElement('button');selectGo.type='button';selectGo.className='utdss-sector-go';selectGo.disabled=true;selectGo.textContent='Open selection →';
  select.addEventListener('change',()=>{selectGo.disabled=!select.value;});
  selectGo.addEventListener('click',()=>{if(select.value&&definition.options.some(([,url])=>url===select.value))window.location.assign(select.value);});
  selectorWrap.append(selectorLabel,select,selectGo);
  panel.append(description,selectorWrap,options);
  container.append(trigger,panel);
  let opened=false;
  const setOpen=show=>{
    opened=show;
    container.classList.toggle('is-expanded',show);
    trigger.setAttribute('aria-expanded',String(show));
    panel.setAttribute('aria-hidden',String(!show));
    options.querySelectorAll('a').forEach(a=>a.tabIndex=show?0:-1);
  };
  setOpen(false);
  const canHover=window.matchMedia('(hover:hover) and (pointer:fine)');
  container.addEventListener('mouseenter',()=>{if(canHover.matches)setOpen(true)});
  container.addEventListener('mouseleave',()=>{if(canHover.matches&& !container.contains(document.activeElement))setOpen(false)});
  container.addEventListener('focusin',e=>{if(e.target!==trigger||trigger.matches(':focus-visible'))setOpen(true)});
  container.addEventListener('focusout',e=>{if(!container.contains(e.relatedTarget))setOpen(false)});
  trigger.addEventListener('click',()=>setOpen(!opened));
  container.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){setOpen(false);trigger.focus()}});
  document.addEventListener('pointerdown',e=>{if(opened&&!container.contains(e.target))setOpen(false)},{passive:true});
  const localise=()=>{
    const tr=t=>window.UTDSSLocaleText?window.UTDSSLocaleText(t):t;
    text.textContent=tr('Explore options');
    trigger.setAttribute('aria-label',tr('Show options for')+' '+tr(definition.name));
    panel.setAttribute('aria-label',tr(definition.name)+' '+tr('options'));
    selectorLabel.textContent=tr('Select an option');
    placeholder.textContent=tr('Choose where to go');
    selectGo.textContent=tr('Open selection →');
    [...select.options].slice(1).forEach((option,i)=>{option.textContent=tr(definition.options[i][0]);});
    [...options.querySelectorAll('a')].forEach((a,i)=>{a.textContent=tr(definition.options[i][0]);});
    description.textContent=tr(definition.description);
  };
  localise();
  document.addEventListener('utdss:languagechange',localise);
}
// Homepage: preserve the original clickable image while adding a separate menu control.
document.querySelectorAll('#sectors > a.sector[href]').forEach(anchor=>{
  const route=new URL(anchor.href,location.href).pathname;
  if(!sectorMenuData[route])return;
  const tile=document.createElement('div');tile.className='utdss-home-sector-tile';
  anchor.parentNode.insertBefore(tile,anchor);tile.append(anchor);
  enhanceSectorTile(tile,route);
});
// About and Products: enhance the existing cards without changing their primary links.
document.querySelectorAll('.about-sectors .ed-card, .utdss-page-products .utdss-secondary-grid > .card').forEach(card=>{
  const link=card.querySelector('a[href]');
  if(!link)return;
  const route=new URL(link.href,location.href).pathname;
  if(sectorMenuData[route])enhanceSectorTile(card,route);
});

/* Procurement finder: instant, accessible filtering without an external service. */
function addDirectoryFinder(pageSelector,config){
 const page=document.querySelector(pageSelector);
 if(!page)return;
 const grid=page.querySelector('.utdss-secondary-grid');
 if(!grid||grid.dataset.utdssFinder)return;
 const cards=[...grid.children].filter(el=>el.matches('.card'));
 if(cards.length<2)return;
 grid.dataset.utdssFinder='ready';
 const bar=document.createElement('section');bar.className='utdss-directory-finder';
 bar.setAttribute('aria-label',config.label);
 const inner=document.createElement('div');inner.className='utdss-finder-inner';
 const intro=document.createElement('div');intro.className='utdss-finder-intro';
 const heading=document.createElement('h2');heading.textContent=config.heading;
 const helper=document.createElement('p');helper.textContent=config.help;
 intro.append(heading,helper);
 const form=document.createElement('form');form.setAttribute('role','search');form.className='utdss-finder-form';
 const label=document.createElement('label');label.textContent=config.label;
 const input=document.createElement('input');input.type='search';input.autocomplete='off';
 input.maxLength=80;input.placeholder=config.placeholder;
 input.setAttribute('aria-label',config.label);
 const clear=document.createElement('button');clear.type='button';clear.textContent='Clear';clear.hidden=true;
 const status=document.createElement('p');status.className='utdss-finder-status';
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const empty=document.createElement('p');empty.className='utdss-finder-empty';empty.hidden=true;
 empty.textContent='No matching entries. Try a different keyword or send us a sourcing enquiry.';
 label.append(input);form.append(label,clear);
 const count=()=>{
  const value=input.value.toLocaleLowerCase().trim();
  let shown=0;
  for(const card of cards){
   const text=(card.textContent||'').toLocaleLowerCase();
   const match=!value||value.split(/\s+/).every(term=>text.includes(term));
   card.hidden=!match;if(match)shown++;
  }
  clear.hidden=!value;
  status.textContent=value?shown+' of '+cards.length+' results':cards.length+' categories and entries';
  if(config.kind==='brands')status.textContent=value?shown+' of '+cards.length+' brands':cards.length+' brands listed for enquiry';
  empty.hidden=shown!==0;
 };
 form.addEventListener('submit',event=>event.preventDefault());
 input.addEventListener('input',count);
 clear.addEventListener('click',()=>{input.value='';count();input.focus()});
 inner.append(intro,form,status,empty);bar.append(inner);grid.parentNode.insertBefore(bar,grid);
 count();
}
addDirectoryFinder('.utdss-page-products',{heading:'Find a supply category',help:'Search by industry or product type. Categories are examples, not live inventory.',label:'Search supply categories',placeholder:'Try marine, industrial or NSN',kind:'categories'});
addDirectoryFinder('.utdss-page-agencies',{heading:'Explore brands',help:'Find a listed brand and contact UTDSS to confirm the current sourcing arrangement.',label:'Search listed brands',placeholder:'Search a brand name',kind:'brands'});

})();
