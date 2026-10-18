import test from 'node:test';
import assert from 'node:assert/strict';
import { searchPages,createSearchSession } from '../src/search.mjs';
import { createServer } from '../scripts/serve.mjs';
test('search handles case, empty input, category and hostile text literally', () => {
  const items=[{title:'Pickaxe Guide',summary:'Upgrade your tools',keywords:['power'],category:'upgrades'}];
  assert.equal(searchPages(items,'PICKAXE').length,1);
  assert.equal(searchPages(items,'').length,1);
  assert.equal(searchPages(items,'power').length,1);
  assert.equal(searchPages(items,'','eggs').length,0);
  assert.equal(searchPages(items,'<img onerror=alert(1)>').length,0);
});
test('pending initial search renders only the newest request even when queries repeat',async()=>{
 let finish;const loaded=new Promise(resolve=>{finish=resolve;});
 const search=createSearchSession(()=>loaded);
 const first=search(''),second=search('pickaxe'),third=search('');
 finish([{title:'Pickaxe',summary:'Tool',keywords:[],category:'upgrades'}]);
 assert.equal(await first,null);assert.equal(await second,null);assert.equal((await third).length,1);
});
test('server serves queries, assets and real 404 responses without exposing source', async () => {
  const server=createServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  try {
    const root=`http://127.0.0.1:${server.address().port}`;
    assert.equal((await fetch(root+'/en/?q=egg')).status,200);
    assert.match((await fetch(root+'/assets/styles.css')).headers.get('content-type'),/text\/css/);
    assert.equal((await fetch(root+'/missing/')).status,404);
    assert.equal((await fetch(root+'/content/articles.mjs')).status,404);
    assert.notEqual((await fetch(root+'/%2e%2e%2fpackage.json')).status,200);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
