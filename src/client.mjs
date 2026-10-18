import {createSearchSession} from './search.mjs';
import {installImageFallback} from './images.mjs';
const $=selector=>document.querySelector(selector);
const menu=$('#mobile-nav'),menuButton=$('[data-menu-toggle]');
menuButton?.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.focus();}});
$('[data-theme-toggle]')?.addEventListener('click',()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('egg-wiki-theme',theme);}catch{}});
$('[data-language]')?.addEventListener('change',e=>{location.href=e.target.value;});
const dialog=$('.search-dialog'),input=$('#site-search'),results=$('#search-results');
let indexPromise;
const runSearch=createSearchSession(()=>indexPromise??=fetch(`/search-index.${document.body.dataset.locale}.json`).then(r=>{if(!r.ok)throw new Error('index');return r.json();}));
async function updateResults(){
 results.replaceChildren();
 try {
  const found=await runSearch(input.value);if(found===null)return;
  if(!found.length){const p=document.createElement('p');p.textContent=results.dataset.empty;results.append(p);}
  for(const item of found){const a=document.createElement('a'),title=document.createElement('strong'),p=document.createElement('p');a.href=item.href;title.textContent=item.title;p.textContent=item.summary;a.append(title,p);results.append(a);}
 }catch{indexPromise=null;const a=document.createElement('a');a.href=`/${document.body.dataset.locale}/guide/`;a.textContent=$('.search-label').textContent;results.append(a);}
}
$('[data-search-open]')?.addEventListener('click',()=>{dialog.showModal();input.focus();updateResults();});
$('[data-search-close]')?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
input?.addEventListener('input',updateResults);
$('[data-guide-filter]')?.addEventListener('input',e=>{let visible=0;for(const card of document.querySelectorAll('.directory-card')){card.hidden=!card.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase().trim());if(!card.hidden)visible++;}$('.filter-empty').hidden=visible>0;});
$('[data-video-play]')?.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src='https://www.youtube-nocookie.com/embed/MtNnuhxs5jk?autoplay=1';frame.title='Foltyn — Break and Steal an Egg gameplay';frame.allow='autoplay; encrypted-media; picture-in-picture';frame.allowFullscreen=true;$('[data-video]').replaceChildren(frame);});
for(const img of document.images)installImageFallback(img);
