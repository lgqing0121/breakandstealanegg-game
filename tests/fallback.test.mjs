import test from 'node:test';
import assert from 'node:assert/strict';
import {installImageFallback} from '../src/images.mjs';
import {renderPage} from '../src/templates.mjs';
import {pages} from '../content/articles.mjs';
test('already failed image gets local fallback immediately and does not loop',()=>{
 const image=new EventTarget();Object.assign(image,{complete:true,naturalWidth:0,dataset:{},src:'/missing.png',classList:new Set()});
 installImageFallback(image);
 assert.equal(image.src,'/assets/android-chrome-512x512.png');
 image.src='/also-missing.png';image.dispatchEvent(new Event('error'));
 assert.equal(image.src,'/also-missing.png');
});
test('footer language links preserve article and artwork has no-script fallback',()=>{
 const html=renderPage({locale:'en',page:pages[0]});
 const footer=html.slice(html.indexOf('<footer>'));
 assert.ok(footer.includes('href="/es/beginner-guide/"'));
 const home=renderPage({locale:'en'});
 assert.ok(home.includes('<object'));
 assert.ok(home.includes('type="image/png"'));
});
