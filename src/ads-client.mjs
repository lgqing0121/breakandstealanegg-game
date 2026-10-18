import {bannerFormats,chooseRailFormat} from './ads.mjs';
const preview=['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).has('ad-preview');
function mount(slot,format){
 const holder=slot.querySelector('.ad-mount');
 if(!format){holder.replaceChildren();delete slot.dataset.format;return;}
 if(slot.dataset.format===format)return;
 const ad=bannerFormats[format];slot.dataset.format=format;
 holder.style.width=`${ad.width}px`;holder.style.height=`${ad.height}px`;
 if(preview){holder.textContent=`${ad.width} × ${ad.height}`;holder.classList.add('ad-preview');return;}
 const frame=document.createElement('iframe');frame.src=`/ads/${format}.html`;frame.width=ad.width;frame.height=ad.height;frame.title=slot.getAttribute('aria-label');frame.style.border='0';frame.scrolling='no';holder.replaceChildren(frame);
}
const top=document.querySelector('[data-ad-slot="top"]');
if(top)mount(top,'top');
function resize(){
 const format=chooseRailFormat(innerWidth,innerHeight);
 for(const slot of document.querySelectorAll('[data-ad-slot^="rail-"]'))mount(slot,format);
 const mobile=document.querySelector('[data-ad-slot="mobile-rectangle"]');if(mobile)mount(mobile,innerWidth<1024?'rectangle':null);
}
resize();let pending;addEventListener('resize',()=>{clearTimeout(pending);pending=setTimeout(resize,200);});
if(preview){const native=document.querySelector('.ad-native');if(native){native.classList.add('ad-preview');native.querySelector('[id^="container-"]').textContent='Native Banner';}}
else{
 if(document.querySelector('#container-3952dc2c06c3d82599fb1d1390ce87ba')){
  const native=document.createElement('script');native.async=true;native.dataset.cfasync='false';native.src='https://pl31892919.profitableratecpmnetwork.com/3952dc2c06c3d82599fb1d1390ce87ba/invoke.js';document.body.append(native);
 }
 const social=document.createElement('script');social.async=true;social.src='https://pl31892920.profitableratecpmnetwork.com/78/ff/b9/78ffb90691428d6fe894090b099a409f.js';document.body.append(social);
}
