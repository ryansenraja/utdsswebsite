import fs from 'node:fs';
import path from 'node:path';
const A='assets';fs.mkdirSync(A,{recursive:true});
const palette={cleaning:['#eaf9fb','#65b8c9'],paper:['#eef1f8','#7d92bb'],bins:['#e6f4f0','#65ac83'],safety:['#fff6df','#daaa39'],marine:['#dcebf7','#367eb0'],aviation:['#e3edf8','#6c9fcb'],office:['#e9edf9','#8b9bce'],provisions:['#fff1e2','#db9a65'],hardware:['#ecf1f6','#74899e'],electrical:['#fff6db','#edba55']};
const picture={
cleaning:'<rect x="300" y="285" width="175" height="260" rx="26"/><rect x="350" y="244" width="80" height="48" rx="9"/><path d="M350 244v-28h130l33 17-6 15H430"/><rect x="650" y="335" width="155" height="210" rx="25"/><rect x="685" y="294" width="84" height="47" rx="13"/><path d="M360 419h66m258 12h82"/>',
paper:'<ellipse cx="440" cy="445" rx="170" ry="110"/><ellipse cx="440" cy="445" rx="53" ry="40"/><ellipse cx="730" cy="445" rx="170" ry="110"/><ellipse cx="730" cy="445" rx="53" ry="40"/><path d="M290 435q80-170 310-70m-60 145q80 60 220 0"/>',
bins:'<path d="M290 315h270l-28 280H320zM282 293h288M350 285v-27h140v27"/><path d="M680 290h290l-36 305H716zM672 275h306M742 270v-24h160v24"/><path d="M360 365v170m67-170v170m67-170v170m270-170v170m80-170v170"/>',
safety:'<path d="M280 465q10-180 180-194 180 14 180 194h-360zM264 478h400v45H264zM440 288v95M350 308l35 67M520 308l-35 67"/><path d="M715 390h210v170H715zM749 410l55 55 98-112"/>',
marine:'<path d="M240 475h680l-115 145H360zM380 470V280h340v190M450 275v-62h200v62M330 480l110 70 120-70 130 70 115-70"/><path d="M260 654q55-40 110 0t110 0t110 0t110 0t110 0t110 0"/>',
aviation:'<path d="M250 422l400-95 270 95-270 28-110 138h-95l45-145-240 14zM625 330l-70-128h108l112 152M300 445l-50 57 125-22"/><circle cx="650" cy="388" r="22"/>',
office:'<rect x="290" y="270" width="420" height="290" rx="18"/><path d="M330 330h320m-320 58h320m-320 58h240M745 355h190v230H745zM780 410h120m-120 55h120m-120 55h75"/>',
provisions:'<path d="M288 375h400l-37 210H325zM350 370v-85h285v85M720 315h172l40 265H680zM770 320v-65h92v65M750 430h140"/><circle cx="410" cy="480" r="35"/><circle cx="540" cy="480" r="35"/>',
hardware:'<circle cx="420" cy="405" r="160"/><circle cx="420" cy="405" r="67"/><path d="M420 222v72m0 220v75M240 405h75m210 0h75M290 272l55 55m145 145 55 55M545 272l-55 55M345 472l-55 55"/><path d="M695 285l90 90-145 145 60 60 145-145 90 90 45-45-100-100 55-55-95-95z"/>',
electrical:'<path d="M390 260a170 170 0 0 0-90 315l25 100h132l22-100a170 170 0 0 0-89-315zM324 540h132m-115 60h96m-78 42h60"/><path d="M765 270l-100 180h110l-75 185 255-265H820l45-100z"/>'
};
const backgrounds=(a,b)=>`<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="ink" x2="0" y2="1"><stop stop-color="${b}"/><stop offset="1" stop-color="#103a68"/></linearGradient><pattern id="mesh" width="65" height="65" patternUnits="userSpaceOnUse"><path d="M65 0H0V65" fill="none" stroke="#133f6c" stroke-opacity=".06"/></pattern></defs><rect width="1200" height="800" fill="url(#bg)"/><rect width="1200" height="800" fill="url(#mesh)"/><circle cx="1050" cy="110" r="245" fill="${b}" fill-opacity=".13"/><circle cx="130" cy="720" r="245" fill="${b}" fill-opacity=".11"/>`;
for(const [name,colors] of Object.entries(palette)){
 const shapes=picture[name];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-label="Illustrative ${name} supply category">${backgrounds(...colors)}<g fill="url(#ink)" fill-opacity=".14" stroke="#123d6c" stroke-width="24" stroke-linejoin="round" stroke-linecap="round">${shapes}</g><path d="M0 720h1200v80H0z" fill="#0b2b56" fill-opacity=".07"/></svg>`;
 fs.writeFileSync(path.join(A,name+'.svg'),svg);
}
function hero(which){
 const sea=which==='ship';
 const shapes=sea?'<path d="M140 630h1510l-225 190H345zM350 625V330h900v295M500 330V200h410v130M700 200V110h85v90M375 430h800M350 540h900"/><path d="M210 875q105-55 210 0t210 0t210 0t210 0t210 0t210 0"/>':'<path d="M90 570l845-210 770 210-770 85-240 335H545l110-315-565 80zM910 380L770 90h160l235 330M220 650L90 785l280-75"/>';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="1200" viewBox="0 0 2000 1200" role="img" aria-label="Illustrative ${sea?'maritime vessel':'aircraft'}"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#b1d2ec"/><stop offset=".7" stop-color="#eaf1fa"/><stop offset="1" stop-color="#f4d4a5"/></linearGradient><linearGradient id="v" x2="0" y2="1"><stop stop-color="#2a679b"/><stop offset="1" stop-color="#092b51"/></linearGradient></defs><rect width="2000" height="1200" fill="url(#sky)"/><circle cx="1550" cy="240" r="185" fill="#fff" fill-opacity=".65"/><g stroke="#fff" stroke-width="5" opacity=".65"><path d="M0 220h700M880 280h1120M0 410h500"/></g><path d="M0 895q260-115 470 0t490 0t520 0t520 0V1200H0z" fill="#558eb9" fill-opacity=".28"/><g fill="url(#v)" fill-opacity=".95" stroke="#093462" stroke-width="19" stroke-linejoin="round" stroke-linecap="round">${shapes}</g></svg>`;
}
fs.writeFileSync(path.join(A,'hero-ship.svg'),hero('ship'));
fs.writeFileSync(path.join(A,'hero-air.svg'),hero('air'));
console.log('Created 12 original resolution-independent SVG images');
