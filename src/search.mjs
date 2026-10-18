export function searchPages(items,query,category=''){
 const tokens=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return items.filter(item=>(!category||item.category===category)&&tokens.every(token=>[item.title,item.summary,...(item.keywords||[])].join(' ').toLocaleLowerCase().includes(token)));
}
export function createSearchSession(load){
 let version=0;
 return async query=>{const request=++version;const items=await load();return request===version?searchPages(items,query):null;};
}
