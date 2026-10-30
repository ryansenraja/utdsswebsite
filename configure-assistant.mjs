import fs from 'node:fs';const p='/app/server/server.js';let s=fs.readFileSync(p,'utf8');
s=s.replace("process.env.OPENAI_TTS_VOICE||'marin'","process.env.OPENAI_TTS_VOICE||'shimmer'");
s=s.replace("const allowed=new Set(['en','zh','ms','ta','hi','id','ja','ko','ar','es','fr']);","const allowed=new Set(['auto','en','zh','ms','ta','hi','id','ja','ko','ar','es','fr']);");
s=s.replace("const locale=lang.split('-')[0].toLowerCase();","const locale=lang.split('-')[0].toLowerCase();");
s=s.replace("Speak in the same language as this text (${locale}).","Speak in the same language as the provided text, including when the language is auto-detected.");
s=s.replace("Speak as a warm, experienced Singapore-based customer support colleague","Use a natural, feminine-sounding, warm Singapore-based customer support speaking style");
s=s.replace("Most replies should be one or two short paragraphs","Respond in the same language the customer uses when possible, including languages not in a preset list. When the message mixes languages, follow the primary language. Most replies should be one or two short paragraphs");
fs.writeFileSync(p,s,'utf8');console.log('Assistant voice and multilingual server preferences updated');