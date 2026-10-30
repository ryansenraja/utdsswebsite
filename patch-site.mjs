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
