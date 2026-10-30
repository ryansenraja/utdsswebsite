import fs from 'node:fs';
const file='index.html';
let html=fs.readFileSync(file,'utf8');
const replace=(before,after,label)=>{if(!html.includes(before)){console.warn('Patch not applied:',label);return;}html=html.replace(before,after);console.log('Applied:',label)};
replace(
"const payload={name:fullName.value.trim(),organisation:company.value.trim(),email:email.value.trim(),phone:phone.value.trim(),category:category.value,delivery:delivery.value.trim(),items:rows,message:composeMessage()};",
"const payload={name:fullName.value.trim(),organisation:company.value.trim(),email:email.value.trim(),phone:phone.value.trim(),category:category.value,type:category.value,delivery:delivery.value.trim(),items:rows,message:composeMessage(),consent:true};",
'web enquiry payload');
replace(
"statusBox.className='status success'; statusBox.textContent='Your message has been accepted by the server and prepared for UTDSS.';",
"const result=await r.json();if(!result.delivered)throw new Error('Email not delivered');statusBox.className='status success'; statusBox.textContent='Your enquiry was delivered to UTDSS. Reference: '+(result.reference||'Available on request');",
'delivery acknowledgement');
replace(
"if(voiceOn && !voiceAvailable){ addBubble('Voice will work once the live server is connected. For now, I’ll continue helping by text.'); }",
"if(voiceOn && !voiceAvailable){ addBubble('Voice is using your browser’s speech engine until our premium neural voice is activated. The sound depends on your browser and installed voices.'); }",
'voice status');
replace(
"async function speak(text){ if(!voiceOn || !voiceAvailable) return; try{",
"async function speak(text){ if(!voiceOn)return; if(!voiceAvailable){if('speechSynthesis' in window){speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.94;u.pitch=1;const locales={English:'en-SG',Chinese:'zh-CN',Malay:'ms-MY',Tamil:'ta-IN'};u.lang=locales[langSelect.value]||'en-SG';const voices=speechSynthesis.getVoices();const selected=voices.find(v=>v.lang.toLowerCase().startsWith(u.lang.slice(0,2).toLowerCase()));if(selected)u.voice=selected;speechSynthesis.speak(u);}else addBubble('Sorry, this browser does not support speech playback.');return;} try{",
'browser voice fallback');
replace(
"stopVoiceBtn.onclick=()=>{ if(currentAudio){currentAudio.pause(); currentAudio=null;} };",
"stopVoiceBtn.onclick=()=>{ if(currentAudio){currentAudio.pause(); currentAudio=null;} if('speechSynthesis' in window)speechSynthesis.cancel(); };",
'stop browser voice');
replace(
"if(voiceOn && !voiceAvailable){",
"if(!voiceOn && 'speechSynthesis' in window)speechSynthesis.cancel();if(voiceOn && !voiceAvailable){",
'stop when switching off');
replace(
"const win=window.open(outlookURL,'_blank','noopener,noreferrer');",
"const win=window.open(outlookURL,'_blank');",
'Outlook popup reliability');
replace(
'<div class="online">Online</div>',
'<div class="online">Virtual assistant · AI voice when available</div>',
'accurate assistant state');
replace(
"const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});",
"const r=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});",
'no-op');
fs.writeFileSync(file,html,'utf8');


// Professional customer support: intent-sensitive offline replies and navigation.
const originalFallback="let response = offlineResponses.find(r=>r.match.test(input))?.text ||";
const improvedFallback="let response = professionalReplies.find(r=>r.match.test(input))?.text || offlineResponses.find(r=>r.match.test(input))?.text ||";
const intentCode=`const professionalReplies=[
 {match:/complain|complaint|wrong item|damaged|refund|unhappy|problem/i,text:'I’m sorry to hear about the issue. I can help you prepare a clear message for the team. Please include your order reference, a brief description of what happened and what resolution you’re hoping for. You don’t need to share payment information here.'},
 {match:/urgent|asap|emergency|rush order/i,text:'I understand this is urgent. Please tell us the item, quantity, destination and required date in your enquiry. Our team will check what may be possible and confirm the timing directly.'},
 {match:/stock|inventory|available now|in stock/i,text:'I can help you check an item with our team, but I can’t see live stock. Include the item description, NSN or MPN and quantity in the enquiry form so availability can be confirmed.'},
 {match:/nsn|mpn|part number|compatible|equivalent|certificat|specification/i,text:'For technical sourcing, please share the exact NSN or manufacturer part number, quantity and any specifications you have. We can help route the request, while our team confirms compatibility, certification and availability before quoting.'},
 {match:/lead time|delivery|shipping|shipment/i,text:'For delivery enquiries, please provide the destination, quantity and preferred delivery date. Our team can confirm the available arrangements after reviewing the details.'},
 {match:/human|staff|representative|speak to someone/i,text:'Of course. You can reach the UTDSS team by completing the enquiry form or opening the prepared message in Outlook. I can help you list the details first if you’d like.'}
];`;
const promptAnchor='const offlineResponses=[';
if(!html.includes(promptAnchor)) throw Error('Missing assistant anchor');
html=html.replace(promptAnchor,intentCode+'\n    '+promptAnchor);
if(!html.includes(originalFallback))throw Error('Missing fallback anchor');
html=html.replace(originalFallback,improvedFallback);
const oldChat="body:JSON.stringify({messages:[{role:'user',content:input}],language:langSelect.value})";
const newChat="body:JSON.stringify({messages:[...conversation.slice(-8),{role:'user',content:input}],language:langSelect.value})";
html=html.replace('const offlineResponses=[','const conversation=[];\n    const offlineResponses=[');
if(!html.includes(oldChat))throw Error('Missing AI request anchor');
html=html.replace(oldChat,newChat);
const answerAnchor='if(answer){ addBubble(answer); speak(answer); return; }';
if(!html.includes(answerAnchor))throw Error('Missing AI answer anchor');
html=html.replace(answerAnchor,"if(answer){ conversation.push({role:'user',content:input},{role:'assistant',content:answer});addBubble(answer);speak(answer);if(data.escalate||data.navigate==='contact')document.getElementById('rfq').scrollIntoView({behavior:'smooth'});else if(data.navigate==='catalogue')document.getElementById('products').scrollIntoView({behavior:'smooth'});return; }");
html=html.replace('No problem — the quickest way is to use the quotation form below.','I can help you organise a detailed quotation request.');
fs.writeFileSync(file,html,'utf8');
const serverFile='server/server.js';let server=fs.readFileSync(serverFile,'utf8');
const prompt='PROFESSIONAL B2B CUSTOMER SERVICE: Practice attentive listening and concise, context-aware replies. Clarify item details (description, NSN, manufacturer part number, quantity, destination, required date) one missing point at a time. For complaints, acknowledge and escalate with order reference and desired outcome; never blame the customer. For urgent orders, acknowledge urgency without delivery promises. Never invent stock, prices, client contracts, certifications, technical interchangeability, or shipping guarantees. Disclose you are a virtual assistant. Never ask for private credentials or sensitive payment information. Help users choose either website email submission when configured or Outlook prepared email. Preserve conversation context and adapt tone to the customer. ';
if(!server.includes('const aiSystem=`'))throw Error('Missing system prompt');
server=server.replace('const aiSystem=`','const aiSystem=`'+prompt);
fs.writeFileSync(serverFile,server,'utf8');
console.log('Professional assistant upgrade applied');