(()=>{
'use strict';
const TO='utdss@singnet.com.sg';
const KEY='utdss.smartdesk.draft.v1';
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
const defaults=()=>({description:'',quantity:'1',unit:'Pieces',brand:'',model:'',nsn:'',mpn:'',specs:'',remarks:''});
const trim=x=>String(x??'').replace(/[\r\n]+/g,' ').trim();
function setStatus(id,text,kind=''){const el=$(id);el.textContent=text;el.className='status '+kind;}
function inputRow(key,title,placeholder='',span=''){const tag=key==='unit'?'select':'input';const options=['Pieces','Sets','Pairs','Boxes','Cartons','Metres','Litres','Other'];return '<label class="'+span+'">'+title+(tag==='select'?'<select data-key="'+key+'">'+options.map(x=>'<option>'+x+'</option>').join('')+'</select>':'<input data-key="'+key+'" '+(key==='quantity'?'type="number" min="1" step="1" max="99999999" inputmode="numeric"':'maxlength="'+(key==='specs'?500:200)+'"')+' placeholder="'+placeholder+'">')+'</label>';}
function createItem(data=defaults()){
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
card.querySelector('.remove-item').addEventListener('click',()=>{if(itemsEl.children.length<=1){setStatus('draftStatus','Keep at least one item.','error');return;}card.remove();refresh();});
card.addEventListener('input',refresh);card.addEventListener('change',refresh);
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
});const data=getData();$('summary').textContent=data.items.length+' product'+(data.items.length===1?'':'s')+' · '+(data.company||'Company not entered');$('preview').textContent='Subject: '+subject(data)+'\n\n'+compose(data);}
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
if(!/^\d+$/.test(x.quantity)||Number(x.quantity)<1){card.querySelector('[data-key="quantity"]').focus();return 'Product '+(i+1)+' requires a valid quantity.';}
if(![x.brand,x.model,x.nsn,x.mpn,x.specs].some(Boolean)){card.querySelector('[data-key="specs"]').focus();return 'Product '+(i+1)+' requires at least one identifying detail.';}
}return '';
}
function renderCategories(){const q=$('catalogSearch').value.trim().toLowerCase();const out=categories.filter(x=>(x.name+' '+x.sector+' '+x.terms+' '+x.hint).toLowerCase().includes(q));$('catalogResults').replaceChildren();$('catalogEmpty').classList.toggle('hidden',out.length>0);
out.forEach(cat=>{const card=document.createElement('article');card.className='catalog-card';const b=document.createElement('strong');b.textContent=cat.name;const badge=document.createElement('span');badge.className='badge';badge.textContent=cat.sector;const text=document.createElement('small');text.textContent=cat.hint;const btn=document.createElement('button');btn.type='button';btn.textContent='Use category →';btn.addEventListener('click',()=>{const sector=$('sector');sector.value=cat.sector;const first=[...itemsEl.children].find(x=>!values(x).description);const row=first||createItem();const el=row.querySelector('[data-key="description"]');el.value=cat.name;refresh();row.scrollIntoView({behavior:'smooth',block:'center'});setStatus('draftStatus','Category added as a starting point. Replace it with the precise product description and part details.');});card.append(badge,b,text,btn);$('catalogResults').append(card);});}
$('catalogSearch').addEventListener('input',renderCategories);
$('addItem').addEventListener('click',()=>{const card=createItem();card.querySelector('[data-key="description"]').focus();});
fields.forEach(k=>{$(k).addEventListener('input',refresh);$(k).addEventListener('change',refresh);});
$('saveDraft').addEventListener('click',()=>{try{const data=getData();localStorage.setItem(KEY,JSON.stringify({version:1,savedAt:new Date().toISOString(),data}));setStatus('draftStatus','Draft saved to this browser on this device. It has not been sent.','success');}catch{setStatus('draftStatus','Could not save draft (browser storage unavailable or full). Use Copy full enquiry instead.','error');}});
$('loadDraft').addEventListener('click',()=>{let parsed;try{parsed=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}if(!parsed?.data||!Array.isArray(parsed.data.items)){setStatus('draftStatus','No saved draft found in this browser.','error');return;}for(const k of fields)$(k).value=String(parsed.data[k]||'');itemsEl.replaceChildren();parsed.data.items.slice(0,80).forEach(item=>createItem(item));if(!itemsEl.children.length)createItem();refresh();setStatus('draftStatus','Saved draft restored. Please check details before preparing your email.','success');});
$('clearDraft').addEventListener('click',()=>{if(!confirm('Clear all entered details and the saved draft on this device?'))return;try{localStorage.removeItem(KEY);}catch{}for(const k of fields)$(k).value='';$('files').value='';itemsEl.replaceChildren();createItem();refresh();setStatus('draftStatus','Current form and saved draft cleared.');});
$('outlook').addEventListener('click',()=>{const d=getData();const err=validate(d);if(err){setStatus('status',err,'error');return;}const url='mailto:'+TO+'?subject='+encodeURIComponent(subject(d))+'&body='+encodeURIComponent(compose(d));if(url.length>7200){setStatus('status','This enquiry is too long for a reliable email link. Use Copy full enquiry and paste it into a new email to '+TO+'.','error');return;}location.href=url;setStatus('status','Your email application has been requested. Check the recipient, attach files manually and click Send. Nothing has been sent by the website.','');});
$('copy').addEventListener('click',async()=>{const d=getData();const err=validate(d);if(err){setStatus('status',err,'error');return;}const t='To: '+TO+'\nSubject: '+subject(d)+'\n\n'+compose(d);try{await navigator.clipboard.writeText(t);setStatus('status','Copied. Paste into Outlook and click Send to reach '+TO+'.','success');}catch{setStatus('status','Clipboard unavailable; select and copy the preview text manually.','error');}});
$('downloadCsv').addEventListener('click',()=>{const d=getData();const headers=['Item','Description','Quantity','Unit','Manufacturer','Model','NSN','MPN','Specifications','Remarks'];const cell=s=>'"'+String(s??'').replace(/"/g,'""')+'"';const rows=d.items.map((x,i)=>[i+1,x.description,x.quantity,x.unit,x.brand,x.model,x.nsn,x.mpn,x.specs,x.remarks]);const csv='\uFEFF'+[headers,...rows].map(row=>row.map(cell).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='UTDSS-RFQ-Items.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('draftStatus','Item list exported to CSV. This does not send an enquiry.','success');});
$('print').addEventListener('click',()=>window.print());
createItem();renderCategories();refresh();
})();