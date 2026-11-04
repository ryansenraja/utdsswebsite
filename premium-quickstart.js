(()=>{'use strict';
const form=document.getElementById('utdssQuickstartForm');
if(!form)return;
const select=form.querySelector('select[name="sector"]');
const allowed=new Set(['Maritime','Defence / Institutional','Energy & Offshore','Industrial','Aviation','General / Other']);
form.addEventListener('submit',event=>{
 event.preventDefault();
 const sector=select?.value||'';
 const destination='/sourcing.html'+(allowed.has(sector)?'?sector='+encodeURIComponent(sector):'');
 window.location.assign(destination);
});
})();