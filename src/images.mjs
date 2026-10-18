export function installImageFallback(img){
 const fallback=()=>{if(img.dataset.fallback)return;img.dataset.fallback='true';img.src='/assets/android-chrome-512x512.png';img.classList.add('image-fallback');};
 img.addEventListener('error',fallback);
 if(img.complete&&img.naturalWidth===0)fallback();
}
