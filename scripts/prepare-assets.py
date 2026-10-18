import json,pathlib,re,zipfile,urllib.request,concurrent.futures
root=pathlib.Path.cwd()
base=json.loads(re.search(r'```json\s*([\s\S]*?)```',(root/'首页及favicon_io/首页基础信息.md').read_text(encoding='utf-8')).group(1))
mods=json.loads((root/'首页及favicon_io/首页信息8 个模块完整数据.md').read_text(encoding='utf-8'))['modules']
(root/'content/source-home.json').write_text(json.dumps(base,ensure_ascii=False,indent=2),encoding='utf-8')
(root/'content/source-modules.json').write_text(json.dumps(mods,ensure_ascii=False,indent=2),encoding='utf-8')
with zipfile.ZipFile(root/'首页及favicon_io/favicon_io.zip') as z:
 print('ICON FILES', z.namelist())
 for item in z.infolist():
  if not item.is_dir() and pathlib.Path(item.filename).suffix.lower() in ['.png','.ico']:
   (root/'public/assets'/pathlib.Path(item.filename).name).write_bytes(z.read(item))
hashes=['4286dd8385df9534c4a15c1e3807d656','4b4d098da0a9580c8f90c9a00e251a88','729c0316fa4d67dfb92356ab4906ca46','80fa555d44488434d843732f067b59a3']
def get(pair):
 i,h=pair
 p=root/f'public/assets/egg-{i+1}.png'
 if p.exists():return str(p)
 try:
  data=urllib.request.urlopen(f'https://tr.rbxcdn.com/180DAY-{h}/768/432/Image/Png/noFilter',timeout=25).read()
  assert data[:8]==b'\x89PNG\r\n\x1a\n'
  p.write_bytes(data);return f'egg-{i+1}: {len(data)} bytes'
 except Exception as e:return str(e)
for item in concurrent.futures.ThreadPoolExecutor(4).map(get,enumerate(hashes)):print(item)
