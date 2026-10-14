/* Maratona Marvel: botão de retorno ao topo, respeitando a preferência salva. */
(()=>{
  const button=document.getElementById('back-to-top');
  if(!button)return;
  const PREFKEY='marvel-display-v1';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let enabled=true;
  let framePending=false;

  function refresh(){
    const top=window.scrollY||document.documentElement.scrollTop||0;
    const dialog=document.getElementById('settings');
    button.hidden=!enabled||top<450||Boolean(dialog?.open);
  }

  function readPreference(){
    try{
      const saved=JSON.parse(localStorage.getItem(PREFKEY)||'{}');
      enabled=saved?.backToTop!==false;
    }catch(error){
      enabled=true;
    }
    refresh();
  }

  button.addEventListener('click',()=>{
    window.scrollTo({top:0,behavior:reduced.matches?'auto':'smooth'});
  });
  window.addEventListener('scroll',()=>{
    if(framePending)return;
    framePending=true;
    requestAnimationFrame(()=>{framePending=false;refresh()});
  },{passive:true});
  window.addEventListener('resize',refresh,{passive:true});
  window.addEventListener('pageshow',readPreference);
  window.addEventListener('storage',event=>{
    if(event.key===PREFKEY||event.key===null)readPreference();
  });
  window.addEventListener('marvel-display-updated',event=>{
    if(typeof event.detail?.backToTop==='boolean'){
      enabled=event.detail.backToTop;
      refresh();
    }else readPreference();
  });
  document.addEventListener('visibilitychange',()=>{
    if(!document.hidden)readPreference();
  });
  document.getElementById('settings')?.addEventListener('close',refresh);
  readPreference();
})();
