import fs from 'node:fs';
const file='index.html';
let s=fs.readFileSync(file,'utf8');
const style=String.raw`
<style id="reference-refresh">
:root{--navy:#102d55;--blue:#0e64bd;--ink:#173152;--line:#dce4ee;--gold:#d7ae56}
body{background:#fff;font-family:Arial,Helvetica,sans-serif}
.topbar{display:none}
.header{position:sticky;top:0;box-shadow:0 1px 4px #0b2e5214}
.header .wrap{max-width:1520px;min-height:90px}
.brand{gap:10px}
.brand img{width:78px;max-height:76px;object-fit:contain}
.brand-title h1{font-family:Georgia,serif;font-size:22px;line-height:1.1}
.brand-title p{font-size:10px;letter-spacing:.14em}
.nav{gap:26px}
.nav a{font-size:13px}
.header .cta{background:transparent;color:#17345a;box-shadow:none;font-size:13px}
.hero{background:#0d294c}
.hero-grid{display:grid;grid-template-columns:34% 33% 33%;min-height:470px}
.hero-left{background-position:center;background-size:cover;filter:saturate(1.08)}
.hero-right{background-position:center;background-size:cover;filter:saturate(1.06)}
.hero-center{background:linear-gradient(135deg,#092440,#193c63 65%,#234d70);padding:54px 36px}
.hero-center:before{content:"TRUSTED. RESPONSIVE. GLOBAL.";color:#dcb45a;font-size:12px;font-weight:bold;letter-spacing:.16em;margin-bottom:16px}
.hero-center h2{font-family:Georgia,serif;color:#fff;text-transform:uppercase;font-size:43px;line-height:1.08;letter-spacing:-.015em}
.hero-center p.sub{color:#f7f9fd;font-weight:500;font-size:15px}
.hero-center p.meta{color:#dce6f1;font-size:14px}
.hero-center .cta{background:linear-gradient(#e9ca84,#d2a64d);color:#112c4e!important;border-radius:6px;padding:14px 24px;font-size:15px}
.pillar-row{background:#0b2039;max-width:none;grid-template-columns:repeat(5,1fr);gap:0;padding:14px max(18px,calc((100vw - 1440px)/2)) 16px}
.pillar{background:transparent;border:0;box-shadow:none;border-radius:0;padding:12px 18px;color:white}
.pillar-icon{background:#16395f;color:#fff;font-size:27px}
.pillar h3{color:#fff;font-size:15px}
.pillar p{color:#d5e0ec;font-size:12px}
#products .wrap,#about .wrap,#rfq .wrap{max-width:1500px}
.section-title h3{font-family:Georgia,serif;font-size:25px}
.product-grid{grid-template-columns:repeat(5,1fr);gap:14px}
.product-card{border-radius:5px}
.product-card img{aspect-ratio:5/3;object-fit:cover}
.product-card .info{background:linear-gradient(180deg,#163d6e,#0a2b53);min-height:74px}
.product-card h4{text-transform:uppercase;font-size:14px}
.product-card button{color:#164d86}
#about{background:#f8fafd}
.about-card,.why-card{box-shadow:none;border:0;border-left:4px solid #d2ae60;border-radius:0}
#rfq{background:#fff}
.rfq-card{border-radius:0;box-shadow:none;border:0}
.rfq-card h4{font-family:Georgia,serif;text-transform:uppercase;color:#0f315e;border-left:4px solid #d7ae56;padding-left:16px}
#itemTable th{background:#f7fafe;color:#0b2d55}
.primary{background:#1265c9}
.secondary{border-color:#aac1df}
.assistant-button{background:#0d3568;border-radius:12px}
.assistant-panel{border-radius:18px}
.assistant-head{background:#f3f6fb;color:#0e2c54}
.assistant-head h5{color:#0e2c54}
.assistant-head p{color:#395d81}
.assistant-head img{background:transparent}
.online{color:#305a83}
@media(min-width:1280px){
 #products{padding-top:18px}
 #products .filters{margin-top:8px}
 #about,#rfq{padding-top:28px}
 .assistant-panel{display:block!important;bottom:100px;right:16px;width:340px;max-height:calc(100vh - 180px);overflow:auto}
}
@media(max-width:980px){.hero-grid{grid-template-columns:1fr}.hero-center{order:0}.hero-center h2{font-size:38px}.hero-left,.hero-right{min-height:200px}.pillar-row{grid-template-columns:repeat(2,1fr)}.product-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:600px){.hero-center h2{font-size:31px}.pillar-row,.product-grid{grid-template-columns:1fr}.assistant-panel{max-width:calc(100vw - 24px)}}
</style>
`;
s=s.replace('</head>',style+'\n</head>');
const add=String.raw`
<script id="reference-layout">
(()=>{document.addEventListener('DOMContentLoaded',()=>{
 const sections=document.querySelectorAll('#products .section-title h3');
 if(sections[0])sections[0].textContent='Explore Our Sectors & Products';
 const assistant=document.getElementById('assistantPanel');
 if(assistant){const b=document.getElementById('assistantOpen');if(b&&window.innerWidth>=1280){assistant.classList.add('visible');b.setAttribute('aria-expanded','true');}}
 const heading=document.querySelector('.assistant-head h5');
 if(heading)heading.textContent='UTDSS AI Assistant';
 const guide=document.querySelector('.rfq-card p.help');
 if(guide)guide.textContent='For an accurate quotation, include the description, NSN, MPN / Part No., quantity and any important remarks. Choose direct website submission (once activated) or open a prepared message in Outlook.';
 const a=document.querySelector('a[href="#rfq"]');
 if(a&&a.textContent.includes('Quotation'))a.textContent='Request a Quotation';
});})();
</script>
`;
s=s.replace('</body>',add+'\n</body>');
fs.writeFileSync(file,s,'utf8');
console.log('Applied screenshot-inspired navy and gold website layout');
