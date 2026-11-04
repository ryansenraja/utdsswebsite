(()=>{
'use strict';
const TO='Utdss@singnet.com';
const KEY='utdss.smartdesk.draft.v1';
const EMAIL_LINK_LIMIT=7200;
const $=id=>document.getElementById(id);
const categories=[
{sector:'Maritime',name:'Vessel and deck supplies',terms:'deck mooring vessel rope marine marine hardware fastener',hint:'Deck equipment, marine fittings, vessel consumables'},
{sector:'Maritime',name:'Marine mechanical components',terms:'pump seal bearing filter engine propeller mechanical pipe',hint:'Pumps, seals, filters and engineering enquiries'},
{sector:'Maritime',name:'Marine safety and maintenance',terms:'safety ppe fire extinguisher lifesaving protective maritime',hint:'Safety equipment and maintenance consumables'},
{sector:'Defence / Institutional',name:'Institutional and government supplies',terms:'government tender gebiz procurement institutional office facility',hint:'Product-led institutional procurement enquiries'},
{sector:'Defence / Institutional',name:'Technical part-number enquiries',terms:'nsn nato stock number part number mpn defence specialised',hint:'Part identification using NSN, MPN and specifications'},
{sector:'Energy & Offshore',name:'Energy and offshore operations',terms:'energy offshore marine plant rig electrical industrial',hint:'Operational and technical supply requirements'},
{sector:'Industrial',name:'Industrial maintenance and MRO',terms:'industrial maintenance repair operations mro tools valves bearing motors',hint:'Maintenance, workshop tools and industrial components'},
{sector:'Industrial',name:'Workplace safety and PPE',terms:'safety gloves helmet ppe protective industrial',hint:'Personal protective equipment and safety consumables'},
{sector:'Aviation',name:'Aviation support supplies',terms:'aircraft aviation aerospace support equipment ground',hint:'Technical and ground-support supply enquiries'},
{sector:'General / Other',name:'Other hard-to-source items',terms:'other unusual specialised item search hard to find unknown',hint:'Submit the exact product description and supporting references'}
];
const fields=['name','company','email','phone','sector','destination','date','reference','notes'];
const itemFields=['description','quantity','unit','brand','model','nsn','mpn','specs','remarks'];
const itemsEl=$('items');
const MAX_ITEMS=50;
let dirty=false;
function markUnsaved(){dirty=true;const status=$('draftStatus');if(status&&status.classList.contains('success')&&status.textContent.includes('saved'))setStatus('draftStatus','You have changes that are not in your saved draft. Save again to keep them.');}
const defaults=()=>({description:'',quantity:'1',unit:'Pieces',brand:'',model:'',nsn:'',mpn:'',specs:'',remarks:''});
const trim=x=>String(x??'').replace(/[\r\n]+/g,' ').trim();
function setStatus(id,text,kind=''){const el=$(id);if(!el)return;el.textContent=text;el.className='status '+kind;}
function savedDraftInfo(){try{const d=JSON.parse(localStorage.getItem(KEY)||'null');return d?.version===1&&Array.isArray(d.data?.items)?d:null;}catch{return null;}}
function formatSavedDate(iso){const d=new Date(iso);return Number.isNaN(d.getTime())?'an earlier session':d.toLocaleString('en-SG',{dateStyle:'medium',timeStyle:'short'});}
function refreshDraftPrompt(){const d=savedDraftInfo();const node=$('draftAvailable');if(!node)return;node.textContent=d?'Saved draft available from '+formatSavedDate(d.savedAt)+'. Restore it when ready.':'No saved draft is stored in this browser.';}
function inputRow(key,title,placeholder='',span=''){const tag=key==='unit'?'select':'input';const options=['Pieces','Sets','Pairs','Boxes','Cartons','Metres','Litres','Other'];return '<label class="'+span+'">'+title+(tag==='select'?'<select data-key="'+key+'">'+options.map(x=>'<option>'+x+'</option>').join('')+'</select>':'<input data-key="'+key+'" '+(key==='quantity'?'type="number" min="1" step="1" max="99999999" inputmode="numeric"':'maxlength="'+(key==='specs'?500:200)+'"')+' placeholder="'+placeholder+'">')+'</label>';}
function createItem(data=defaults()){
if(itemsEl.children.length>=MAX_ITEMS){setStatus('draftStatus','Maximum of '+MAX_ITEMS+' products per enquiry. Split larger enquiries into separate lists.','error');return null;}
const card=document.createElement('article');card.className='item';
card.innerHTML='<header><strong class="item-label"></strong><button type="button" class="remove-item">Remove</button></header><div class="field-grid">'+
inputRow('description','Product description *','Product name and technical application','full')+
inputRow('quantity','Quantity *','e.g. 10')+
inputRow('unit','Unit')+
inputRow('brand','Manufacturer / brand','Manufacturer if known')+
inputRow('model','Model / catalogue code','Model number if available')+
inputRow('nsn','NSN / NATO Stock Number','NSN if known')+
inputRow('mpn','MPN / manufacturer part number','Exact part number')+
inputRow('specs','Specifications / dimensions','Grade, voltage, size, material etc.','full')+
inputRow('remarks','Item notes','Equivalent parts accepted, certification etc.','full')+
'</div><p class="identification" aria-live="polite"></p>';
for(const k of itemFields){const el=card.querySelector('[data-key="'+k+'"]');el.value=String(data[k]??defaults()[k]);}
card.querySelector('.remove-item').addEventListener('click',()=>{if(itemsEl.children.length<=1){setStatus('draftStatus','Keep at least one item.','error');return;}card.remove();markUnsaved();refresh();});
card.addEventListener('input',()=>{markUnsaved();refresh();});card.addEventListener('change',()=>{markUnsaved();refresh();});
itemsEl.append(card);refresh();return card;
}
function values(card){const x={};for(const k of itemFields)x[k]=trim(card.querySelector('[data-key="'+k+'"]').value);return x;}
function allItems(){return [...itemsEl.children].map(values);}
function getData(){const result={items:allItems()};for(const k of fields)result[k]=trim($(k).value);return result;}
function refresh(){[...itemsEl.children].forEach((card,i)=>{
card.querySelector('.item-label').textContent='PRODUCT '+String(i+1).padStart(2,'0');
card.querySelector('.remove-item').disabled=itemsEl.children.length<=1;
const x=values(card);const indicator=card.querySelector('.identification');
const hasIdentity=[x.nsn,x.mpn,x.brand,x.model,x.specs].some(Boolean);
indicator.classList.toggle('ok',Boolean(x.description&&hasIdentity&&Number(x.quantity)>0));
indicator.textContent=!x.description?'Add a product description to begin.':!hasIdentity?'Add a manufacturer, model, NSN, MPN or specifications to identify this item.':!(Number(x.quantity)>0)?'Enter a valid quantity.':'Identification details captured. UTDSS will assess feasibility after you send the enquiry.';
});const data=getData();const readyCount=data.items.filter(x=>x.description&&/^[0-9]+$/.test(x.quantity)&&Number(x.quantity)>0&&[x.nsn,x.mpn,x.brand,x.model,x.specs].some(Boolean)).length;
$('summary').textContent=data.items.length+' product'+(data.items.length===1?'':'s')+' · '+readyCount+' with sufficient identification · '+(data.company||'Company not entered');$('preview').textContent='Subject: '+subject(data)+'\n\n'+compose(data);
const contactReady=Boolean(data.name&&data.company&&$('email').checkValidity()&&data.email);
const itemsReady=Boolean(data.items.length&&readyCount===data.items.length);
const progress=(contactReady?1:0)+(itemsReady?1:0);
const readinessBar=$('rfqReadinessBar'),readinessFill=$('rfqReadinessFill');
if(readinessBar){readinessBar.setAttribute('aria-valuenow',String(progress));readinessBar.setAttribute('aria-valuetext',progress+' of 2 preparation steps complete; customer must send email manually.');}
if(readinessFill)readinessFill.style.width=(progress/2*100)+'%';
const updateReady=(id,ready,text)=>{const node=$(id);if(node){node.textContent=(ready?'✓ ':'○ ')+(window.UTDSSLocaleText?window.UTDSSLocaleText(text):text);node.classList.toggle('ready',ready);}};
updateReady('rfqReadyContact',contactReady,'Contact name, organisation and valid email');
updateReady('rfqReadyItems',itemsReady,'All items identified with valid quantities');
updateReady('rfqReadySend',false,'Review and send from your own email application');

const seen=new Map(),duplicates=[];data.items.forEach((x,i)=>{for(const [type,val] of [['MPN',x.mpn],['NSN',x.nsn]]){if(!val)continue;const key=type+':'+val.toLowerCase().replace(/[^a-z0-9]/g,'');if(seen.has(key))duplicates.push(type+' appears in items '+seen.get(key)+' and '+(i+1));else seen.set(key,i+1);}});const note=$('duplicateNotice');if(note){note.textContent=duplicates.length?'Possible duplicate references: '+duplicates.join('; ')+'. Confirm if both lines are needed.':'';note.classList.toggle('hidden',!duplicates.length);}
updatePrintReport(data);}
function subject(d){return '[UTDSS RFQ] '+(d.company||'Customer enquiry')+(d.reference?' | '+d.reference:'');}
const plain=x=>trim(x)||'-';
function compose(d){const lines=[
'UNITED SHIPPING SERVICES PTE LTD','SOURCING / QUOTATION ENQUIRY','',
'CONTACT INFORMATION','Contact: '+plain(d.name),'Organisation: '+plain(d.company),'Reply-to Email: '+plain(d.email),'Phone: '+plain(d.phone),'',
'ENQUIRY INFORMATION','Sector: '+plain(d.sector),'Destination: '+plain(d.destination),'Requested Date: '+plain(d.date),'Tender / RFQ Reference: '+plain(d.reference),'',
'PRODUCT REQUIREMENTS'];
d.items.forEach((x,i)=>{lines.push('','ITEM '+(i+1),'Description: '+plain(x.description),'Quantity: '+plain(x.quantity)+' '+plain(x.unit),'Manufacturer: '+plain(x.brand),'Model / Catalogue Code: '+plain(x.model),'NSN: '+plain(x.nsn),'MPN / Part Number: '+plain(x.mpn),'Specifications: '+plain(x.specs),'Item Notes: '+plain(x.remarks));});
lines.push('','ADDITIONAL REQUIREMENTS',d.notes||'-','','Please confirm pricing, suitability, availability, lead time and delivery terms.','Any files selected on the website must be attached manually before sending.','Thank you.');
return lines.join('\n');
}
function validate(d){
for(const [key,description] of [['name','your contact name'],['company','your organisation'],['email','a valid reply-to email']]){const el=$(key);if(!d[key]||!el.checkValidity()){el.focus();return 'Please enter '+description+'.';}}
for(const [i,x] of d.items.entries()){
const card=itemsEl.children[i];
if(!x.description){card.querySelector('[data-key="description"]').focus();return 'Product '+(i+1)+' requires a description.';}
if(!/^\d+$/.test(x.quantity)||Number(x.quantity)<1||Number(x.quantity)>99999999){card.querySelector('[data-key="quantity"]').focus();return 'Product '+(i+1)+' requires a valid quantity.';}
if(![x.brand,x.model,x.nsn,x.mpn,x.specs].some(Boolean)){card.querySelector('[data-key="specs"]').focus();return 'Product '+(i+1)+' requires at least one identifying detail.';}
}return '';
}
function renderCategories(){const q=$('catalogSearch').value.trim().toLowerCase();const out=categories.filter(x=>(x.name+' '+x.sector+' '+x.terms+' '+x.hint).toLowerCase().includes(q));$('catalogResults').replaceChildren();$('catalogEmpty').classList.toggle('hidden',out.length>0);
out.forEach(cat=>{const card=document.createElement('article');card.className='catalog-card';const b=document.createElement('strong');b.textContent=cat.name;const badge=document.createElement('span');badge.className='badge';badge.textContent=cat.sector;const text=document.createElement('small');text.textContent=cat.hint;const btn=document.createElement('button');btn.type='button';btn.textContent='Use category →';btn.addEventListener('click',()=>{const sector=$('sector');sector.value=cat.sector;const first=[...itemsEl.children].find(x=>!values(x).description);const row=first||createItem();if(!row)return;const el=row.querySelector('[data-key="description"]');el.value=typeof window.UTDSSLocaleText==='function'?window.UTDSSLocaleText(cat.name):cat.name;markUnsaved();refresh();row.scrollIntoView({behavior:'smooth',block:'center'});setStatus('draftStatus','Category added as a starting point. Replace it with the precise product description and part details.');});card.append(badge,b,text,btn);$('catalogResults').append(card);});}
$('catalogSearch').addEventListener('input',renderCategories);
$('addItem').addEventListener('click',()=>{const card=createItem();if(card){markUnsaved();card.querySelector('[data-key="description"]').focus();}});
fields.forEach(k=>{$(k).addEventListener('input',()=>{markUnsaved();refresh();});$(k).addEventListener('change',()=>{markUnsaved();refresh();});});
$('saveDraft').addEventListener('click',()=>{try{const data=getData();localStorage.setItem(KEY,JSON.stringify({version:1,savedAt:new Date().toISOString(),data}));dirty=false;refreshDraftPrompt();setStatus('draftStatus','Draft saved to this browser on this device. It has not been sent.','success');}catch{setStatus('draftStatus','Could not save draft (browser storage unavailable or full). Use Copy full enquiry instead.','error');}});
$('loadDraft').addEventListener('click',()=>{
const parsed=savedDraftInfo();
if(!parsed){setStatus('draftStatus','No saved draft found in this browser.','error');return;}
if(dirty&&!confirm('Restoring the saved draft will replace your current unsaved changes. Continue?'))return;
const d=parsed.data;for(const k of fields)$(k).value=String(d[k]||'').slice(0,2000);
itemsEl.replaceChildren();
d.items.filter(item=>item&&typeof item==='object'&&!Array.isArray(item)).slice(0,MAX_ITEMS).forEach(item=>createItem(item));
if(!itemsEl.children.length)createItem();
$('files').value='';dirty=false;refresh();refreshDraftPrompt();
setStatus('draftStatus','Draft from '+formatSavedDate(parsed.savedAt)+' restored. Attach supporting documents again before sending.','success');
});
$('clearDraft').addEventListener('click',()=>{if(!confirm('Clear all entered details and the saved draft on this device?'))return;try{localStorage.removeItem(KEY);}catch{}for(const k of fields)$(k).value='';$('files').value='';itemsEl.replaceChildren();createItem();dirty=false;refresh();refreshDraftPrompt();setStatus('draftStatus','Current form and saved draft cleared.');});
$('outlook').addEventListener('click',()=>{const d=getData();const err=validate(d);if(err){setStatus('status',err,'error');return;}const url='mailto:'+TO+'?subject='+encodeURIComponent(subject(d))+'&body='+encodeURIComponent(compose(d));if(url.length>EMAIL_LINK_LIMIT){setStatus('status','The enquiry is too long for a reliable email-app link. Use Copy full enquiry or Download email draft, then paste the contents into Outlook and send to '+TO+'.','error');return;}location.href=url;setStatus('status','Your email application has been requested. Check the recipient, attach files manually and click Send. Nothing has been sent by the website. Your unsaved form remains available here.','');});
$('downloadEmail').addEventListener('click',()=>{const d=getData();const err=validate(d);if(err){setStatus('status',err,'error');return;}const content='To: '+TO+'\nSubject: '+subject(d)+'\n\n'+compose(d);const blob=new Blob([content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='UTDSS-Quotation-Email.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1200);setStatus('status','Email draft downloaded. Open the file, copy its contents to Outlook, attach files and click Send. The website has not transmitted anything.','success');});
$('copy').addEventListener('click',async()=>{const d=getData();const err=validate(d);if(err){setStatus('status',err,'error');return;}const t='To: '+TO+'\nSubject: '+subject(d)+'\n\n'+compose(d);try{await navigator.clipboard.writeText(t);setStatus('status','Copied. Paste into Outlook and click Send to reach '+TO+'.','success');}catch{setStatus('status','Clipboard unavailable; select and copy the preview text manually.','error');}});
$('downloadCsv').addEventListener('click',()=>{const d=getData();const headers=['Item','Description','Quantity','Unit','Manufacturer','Model','NSN','MPN','Specifications','Remarks'];const cell=s=>{let value=String(s??'');if(/^\s*[=+@-]/.test(value))value="'"+value;return '"'+value.replace(/"/g,'""')+'"';};const rows=d.items.map((x,i)=>[i+1,x.description,x.quantity,x.unit,x.brand,x.model,x.nsn,x.mpn,x.specs,x.remarks]);const csv='\uFEFF'+[headers,...rows].map(row=>row.map(cell).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='UTDSS-RFQ-Items.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('draftStatus','Item list exported to CSV. This does not send an enquiry.','success');});
$('print').addEventListener('click',()=>{const d=getData();const err=validate(d);if(err){setStatus('draftStatus','Complete the required fields before preparing a PDF: '+err,'error');return;}updatePrintReport(d);window.print();});
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});
function updatePrintReport(data){const target=$('printReport');if(!target)return;const title=document.createElement('h1');title.textContent='United Shipping Services — Request for Quotation';const to=document.createElement('p');to.textContent='Prepared for: '+TO;const pre=document.createElement('pre');pre.textContent='Subject: '+subject(data)+'\n\n'+compose(data);target.replaceChildren(title,to,pre);}
document.addEventListener('utdss:languagechange',()=>refresh());
createItem();renderCategories();refresh();refreshDraftPrompt();
/* Optional non-sensitive prefill when arriving from a brand or sector page.
   Never restore/sync private customer data from URL parameters. */
function applyDiscoveryReferral(){
 const params=new URLSearchParams(window.location.search);
 const selectedBrand=(params.get('brand')||'').trim().slice(0,80);
 const selectedSector=(params.get('sector')||'').trim().slice(0,80);
 const allowedSectors=['Maritime','Defence / Institutional','Energy & Offshore','Industrial','Aviation','General / Other'];
 if(!selectedBrand&&!selectedSector)return;
 const saved=savedDraftInfo();
 if(saved){
  setStatus('draftStatus','A saved enquiry is available on this device. Restore it if needed before adding a new brand or sector. No saved data has been replaced.','');
 }
 if(selectedSector&&allowedSectors.includes(selectedSector))$('sector').value=selectedSector;
 if(selectedBrand){
  const first=itemsEl.querySelector('.item');
  if(first){const brandField=first.querySelector('[data-key="brand"]');if(brandField)brandField.value=selectedBrand;}
 }
 markUnsaved();refresh();
 const message=selectedBrand?'Selected brand: '+selectedBrand+'. Please add the exact product description, part number and quantity. Brand listings do not guarantee supply or stock.':'Sector selected: '+selectedSector+'. Enter the specific product details and required quantity.';
 setStatus('draftStatus',message);
 const target=document.getElementById('product-details');
 if(target)requestAnimationFrame(()=>target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
}
applyDiscoveryReferral();
})();