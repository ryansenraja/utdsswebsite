(()=>{'use strict';
const langs={en:'English',zh:'中文',ms:'Bahasa Melayu',ta:'தமிழ்'};
const words={
'Home':['首页','Laman Utama','முகப்பு'],
'About Us':['关于我们','Tentang Kami','எங்களைப் பற்றி'],
'Our Services':['我们的服务','Perkhidmatan Kami','எங்கள் சேவைகள்'],
'Services':['服务','Perkhidmatan','சேவைகள்'],
'Sectors':['行业领域','Sektor','துறைகள்'],
'Products':['产品','Produk','தயாரிப்புகள்'],
'Agencies':['代理品牌','Agensi','முகமைகள்'],
'Contact':['联系我们','Hubungi Kami','தொடர்புக்கு'],
'Contact Us':['联系我们','Hubungi Kami','தொடர்புக்கு'],
'Contact & RFQ':['联系与询价','Hubungi & Sebut Harga','தொடர்பு மற்றும் விலை கோரிக்கை'],
'Request a Quotation':['索取报价','Minta Sebut Harga','விலைப்புள்ளி கோருங்கள்'],
'Agency / Stockholding / Reseller':['代理 / 库存 / 经销','Agensi / Stok / Penjual Semula','முகமை / இருப்பு / மறுவிற்பனை'],
'Products & Supply Categories':['产品及供应类别','Produk & Kategori Bekalan','தயாரிப்புகள் மற்றும் விநியோக வகைகள்'],
'Energy & Offshore':['能源与海上作业','Tenaga & Luar Pesisir','ஆற்றல் மற்றும் கடல்சார்'],
'Maritime':['海事','Maritim','கடல்சார்'],
'Defence':['国防','Pertahanan','பாதுகாப்பு'],
'Industrial Supply':['工业供应','Bekalan Industri','தொழில்துறை விநியோகம்'],
'Industrial':['工业','Industri','தொழில்துறை'],
'Aviation':['航空','Penerbangan','விமானப் போக்குவரத்து'],
'Aviation Support':['航空支持','Sokongan Penerbangan','விமான ஆதரவு'],
'About UTDSS':['关于 UTDSS','Mengenai UTDSS','UTDSS பற்றி'],
'Get a quotation':['获取报价','Dapatkan Sebut Harga','விலைப்புள்ளி பெறுங்கள்'],
'Ask about a product':['咨询产品','Tanya Tentang Produk','தயாரிப்பு பற்றி கேளுங்கள்'],
'Our capabilities':['我们的能力','Keupayaan Kami','எங்கள் திறன்கள்'],
'Delivery and logistics':['交付与物流','Penghantaran & Logistik','விநியோகம் மற்றும் போக்குவரத்து'],
'Speak to a human':['联系工作人员','Bercakap Dengan Wakil','ஊழியருடன் பேசுங்கள்'],
'Other questions':['其他问题','Soalan Lain','பிற கேள்விகள்'],
'Chat with UTDSS':['联系 UTDSS 客服','Sembang dengan UTDSS','UTDSS உடன் உரையாடுங்கள்'],
'Close chat':['关闭聊天','Tutup Sembang','உரையாடலை மூடு'],
'How can I help you today?':['今天有什么可以帮您？','Bagaimana Saya Boleh Membantu Anda?','இன்று உங்களுக்கு எப்படி உதவலாம்?'],
'UNITED SHIPPING SERVICES PTE LTD':['UNITED SHIPPING SERVICES PTE LTD','UNITED SHIPPING SERVICES PTE LTD','UNITED SHIPPING SERVICES PTE LTD'],
'Request a quotation →':['索取报价 →','Minta sebut harga →','விலைப்புள்ளி கோரவும் →'],
'Back to Home':['返回首页','Kembali ke Laman Utama','முகப்பிற்கு திரும்பு'],
'Customer support · Multilingual':['多语言客户支持','Sokongan pelanggan pelbagai bahasa','பன்மொழி வாடிக்கையாளர் ஆதரவு'],
'Our business':['我们的业务','Perniagaan Kami','எங்கள் வணிகம்'],
'Procurement approach':['采购方式','Pendekatan Perolehan','கொள்முதல் அணுகுமுறை'],
'Quality and specification review':['质量与规格审核','Semakan Kualiti dan Spesifikasi','தரம் மற்றும் விவரக்குறிப்பு ஆய்வு'],
'Working with UTDSS':['与 UTDSS 合作','Bekerjasama dengan UTDSS','UTDSS உடன் பணிபுரிதல்'],
'Business enquiries':['商务咨询','Pertanyaan Perniagaan','வணிக விசாரணைகள்'],
'Quotation checklist':['询价清单','Senarai Semak Sebut Harga','விலைப்புள்ளி சரிபார்ப்புப் பட்டியல்']
};
const indexes={zh:0,ms:1,ta:2};
const langKey='utdss-display-language';
function selected(){try{return localStorage.getItem(langKey)||'en'}catch{return 'en'}}
let active=selected();if(!langs[active])active='en';
function eligible(el){return !el.closest('script,style,textarea,option,input,[contenteditable],#chatTranscript,#response,#emailState,#speechNotice')&&!(el.closest('#assistant')&&el.tagName==='P')}
const originalNodes=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
let node;while(node=walker.nextNode()){if(!node.parentElement||!eligible(node.parentElement))continue;const raw=node.nodeValue;const trim=raw.trim();if(words[trim])originalNodes.push({node,raw,trim});}
function apply(lang){document.documentElement.lang=lang==='zh'?'zh-Hans':lang;for(const item of originalNodes){const t=lang==='en'?item.trim:words[item.trim]?.[indexes[lang]]||item.trim;item.node.nodeValue=item.raw.replace(item.trim,t)}const select=document.getElementById('utdssLanguageSelect');if(select)select.value=lang;const tip=document.getElementById('translationNotice');if(tip)tip.textContent=lang==='en'?'':lang==='zh'?'部分详细技术说明仍以英语为准。':lang==='ms'?'Sebahagian penerangan teknikal terperinci masih dalam bahasa Inggeris.':'சில விரிவான தொழில்நுட்ப விளக்கங்கள் இன்னும் ஆங்கிலத்தில் உள்ளன.';}
const selector=document.createElement('div');selector.id='utdssLang';selector.innerHTML='<label for="utdssLanguageSelect">🌐 <span class="lang-label">Language</span></label><select id="utdssLanguageSelect" aria-label="Website language">'+Object.entries(langs).map(([id,name])=>'<option value="'+id+'">'+name+'</option>').join('')+'</select>';
const header=document.querySelector('header');if(header)header.append(selector);
const note=document.createElement('div');note.id='translationNotice';note.setAttribute('role','status');if(header)header.insertAdjacentElement('afterend',note);
const css=document.createElement('style');css.textContent='#utdssLang{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-left:auto;padding:5px 9px;background:#f1f5fa;border:1px solid #cbd8e7;border-radius:9px;color:#143b62;font:600 12px Arial,sans-serif;z-index:20}#utdssLang label{white-space:nowrap}#utdssLanguageSelect{font:600 13px Arial,sans-serif;color:#153b62;background:white;border:1px solid #b7c8dc;border-radius:7px;padding:8px;max-width:165px;cursor:pointer}#translationNotice{font:12px Arial,sans-serif;color:#536a84;text-align:right;padding:0 22px;background:#fff}#translationNotice:empty{display:none}@media(max-width:700px){#utdssLang{margin:6px 0 0;width:100%;justify-content:flex-end}#utdssLang .lang-label{display:none}}';document.head.append(css);
selector.querySelector('select').addEventListener('change',e=>{active=e.target.value;try{localStorage.setItem(langKey,active)}catch{}apply(active)});
apply(active);
})();