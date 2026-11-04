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
},{capture:true});
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
})();