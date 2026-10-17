export function prepararPWA(){
 if(!('serviceWorker' in navigator)||!['http:','https:'].includes(location.protocol))return;
 const aviso=document.createElement('div');aviso.className='pwa-status';aviso.setAttribute('role','status');document.querySelector('footer').append(aviso);
 navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(reg=>{
  let recargando=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(recargando)location.reload();});
  const ofrecer=()=>{if(!reg.waiting)return;aviso.replaceChildren();const b=document.createElement('button');b.textContent='Actualizar atlas';b.onclick=()=>{recargando=true;reg.waiting.postMessage({tipo:'ACTIVAR'});};aviso.append(b);};
  ofrecer();reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',()=>{if(w.state==='installed'){if(navigator.serviceWorker.controller)ofrecer();else aviso.textContent='Disponible sin conexión';}if(w.state==='redundant')aviso.textContent='No se pudo preparar la copia sin conexión.';});});
  navigator.serviceWorker.ready.then(()=>{if(!reg.waiting)aviso.textContent='Disponible sin conexión';});
 }).catch(()=>{aviso.textContent='Sin conexión no disponible; puedes seguir usando el atlas en línea.';});
}
