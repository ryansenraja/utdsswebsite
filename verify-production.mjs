// Build-time checks for the UTDSS production web root.
import fs from 'node:fs';
import path from 'node:path';
const root='/app';
const pages=['index.html','about.html','services.html','products.html','agencies.html','contact.html','sourcing.html','defence.html','maritime.html','energy.html','industrial.html','aviation.html'];
const assets=['site-enhancements.css','site-enhancements.js','navigation-experience.js','website-language.js','premium-quickstart.css','premium-quickstart.js','sourcing-desk.js','rfq-experience.css','utdss-favicon.svg'];
const errors=[];
for(const file of [...pages,...assets]){
 const p=path.join(root,file);
 if(!fs.existsSync(p)||!fs.statSync(p).size)errors.push('Missing or empty: '+file);
}
for(const file of pages){
 const p=path.join(root,file);
 if(!fs.existsSync(p))continue;
 const html=fs.readFileSync(p,'utf8');
 for(const match of html.matchAll(/<(?:script|link)[^>]+(?:src|href)=["'](\/[^"'?#]+\.(?:js|css))[^"']*["']/gi)){
  const asset=match[1].slice(1);
  if(!fs.existsSync(path.join(root,asset)))errors.push(file+' references missing '+asset);
 }
}
const homepage=fs.readFileSync(path.join(root,'index.html'),'utf8');
if(!homepage.includes('id="utdssQuickstartForm"'))errors.push('Homepage quick-start form missing');
if(!homepage.includes('id="assistant"'))errors.push('Homepage AI assistant missing');
if(!homepage.includes('class="hero-area"'))errors.push('Homepage hero missing');
if(errors.length){console.error('UTDSS production checks failed:\n'+errors.join('\n'));process.exit(1)}
console.log('UTDSS production checks passed: '+pages.length+' pages and '+assets.length+' essential assets verified.');
