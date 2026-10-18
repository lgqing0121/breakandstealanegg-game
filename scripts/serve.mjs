import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.ico':'image/x-icon','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
export function createServer(){return http.createServer(async(req,res)=>{
 const base=resolve('dist');
 try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  let file=resolve(base,'.'+path);
  if(file!==base&&!file.startsWith(base+sep))throw new Error('outside');
  const info=await stat(file);if(info.isDirectory())file=resolve(file,'index.html');
  const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(body);
 }catch{
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await readFile(resolve(base,'404.html')).catch(()=>Buffer.from('Not found')));
 }
});}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){createServer().listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173/en/'));}
