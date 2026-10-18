import {readFile,readdir,stat,access} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
const root=resolve('dist');
async function walk(dir){const out=[];for(const item of await readdir(dir,{withFileTypes:true})){const p=join(dir,item.name);if(item.isDirectory())out.push(...await walk(p));else if(p.endsWith('.html'))out.push(p);}return out;}
const files=await walk(root),errors=[];let links=0;
const decode=s=>s.replaceAll('&amp;','&');
for(const file of files){
 const html=await readFile(file,'utf8'),rel=file.slice(root.length).replaceAll('\\','/');
 if(!/<html lang="[^"]+"/.test(html))errors.push(rel+': missing language');
 if(!/<title>[^<]+<\/title>/.test(html))errors.push(rel+': missing title');
 if(rel!='/404.html'&&!/name="description" content="[^"]+"/.test(html))errors.push(rel+': missing description');
 if(/href="(?:#|)"/.test(html))errors.push(rel+': empty link');
 if(/\b(?:pastebin|keyless|auto farm|rscripts|inf money)\b/i.test(html))errors.push(rel+': excluded keyword');
 for(const json of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{JSON.parse(json[1]);}catch{errors.push(rel+': invalid JSON-LD');}}
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=decode(m[1]);if(/^(https?:|mailto:|data:)/.test(href))continue;
  const [path,hash]=href.split('#');
  let target=path?resolve(path.startsWith('/')?root:dirname(file),'.'+(path.startsWith('/')?path:'/'+path)):file;
  try{
   if((await stat(target)).isDirectory())target=join(target,'index.html');
   await access(target);links++;
   if(hash&&target.endsWith('.html')){const body=target===file?html:await readFile(target,'utf8');if(!body.includes(`id="${hash}"`))errors.push(rel+': missing anchor '+href);}
  }catch{errors.push(rel+': missing target '+href);}
 }
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Validated ${files.length} HTML pages and ${links} local links/assets; no missing targets or invalid structured data.`);
