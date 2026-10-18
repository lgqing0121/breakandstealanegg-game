export const bannerFormats={
 top:{key:'b6f1f1672cfe61512ae39447771e1bd4',width:320,height:50},
 rectangle:{key:'35f9c495779e7060fd6c55d55d6320ec',width:300,height:250},
 short:{key:'b7b97221c007431d03cf79b966193bbd',width:160,height:300},
 tall:{key:'ae6051499d172137c6caa66007c6c833',width:160,height:600}
};
const labels={en:'Advertisement','pt-br':'Publicidade',es:'Publicidad',id:'Iklan'};
export function chooseRailFormat(width,height){return width<1024?null:height>=850?'tall':'short';}
export function adSlot(slot,locale){return `<aside class="ad-slot ad-${slot}" data-ad-slot="${slot}" aria-label="${labels[locale]||labels.en}"><span class="ad-label">${labels[locale]||labels.en}</span><div class="ad-mount"></div></aside>`;}
export function nativeSlot(locale){return `<aside class="ad-native" aria-label="${labels[locale]||labels.en}"><span class="ad-label">${labels[locale]||labels.en}</span><div id="container-3952dc2c06c3d82599fb1d1390ce87ba"></div></aside>`;}
export function renderBannerDocument(format){
 const ad=bannerFormats[format];if(!ad)throw new Error('Unknown banner format');
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta name="description" content="Adsterra banner placement"><title>Advertisement</title><style>html,body{margin:0;padding:0;width:${ad.width}px;height:${ad.height}px;overflow:hidden;background:transparent}</style></head><body><script>var atOptions={key:'${ad.key}',format:'iframe',height: ${ad.height},width: ${ad.width},params:{}};</script><script src="https://www.highrevenueformat.com/${ad.key}/invoke.js"></script></body></html>`;
}
