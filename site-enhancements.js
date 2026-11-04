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

})();
