/* Compartilhamento do projeto, comum a todas as páginas. */
(()=>{
// Indicação pública da lista. A imagem não usa informações pessoais nem progresso.
const shareUrl='https://michaelfdias.github.io/maratona-marvel/';
const shareText=['🍿 Já viu todos os filmes da Marvel? Ou quer começar uma maratona e não sabe por onde? 👀',
'Encontrei uma lista interativa com 70 filmes, incluindo MCU, X-Men, Homem-Aranha e Deadpool, em uma ordem recomendada.',
'🎬 Você marca os que já assistiu, avalia seus favoritos e acompanha o que falta. É um guia de organização, não um serviço de streaming.'].join('\n\n');
const shareButton=document.getElementById('share-toggle');
const shareStatus=document.getElementById('share-status');
let storyShareFile=null;

// Arte vertical 1080 × 1920 adequada para envio como imagem ou Story.
// É pré-gerada para que navigator.share seja chamado diretamente durante o toque.
// QR Code estático, versão 4 (33×33), EC M, para a URL pública shareUrl.
const storyQrHex=["1fc317a7f","104c34c41","175d63d5d","175b0655d","1759f1a5d","1059cad41","1fd55557f","001953e00","17c88a57c","0f1b9e26f","0c7ce9d16","13b29e99e","07cf51238","0bb1ac247","095935df2","120560bdc","1e77695b1","0607c326d","1059a54f6","190800fbe","176e648bb","101031a45","16d8c24de","12a31799f","155c4a5fb","00109f115","1fcfb9756","105f7c31f","175ff3dfb","175f6cb9d","175475c64","1040248dc","1fd5787a2"];
function drawStoryQR(ctx){
  const bits=storyQrHex.map(row=>parseInt(row,16).toString(2).padStart(33,'0'));
  const cell=7,quiet=28,gridSize=33*cell;
  const x=Math.floor((1080-gridSize)/2),y=1392;
  ctx.fillStyle='#FFFFFF';
  ctx.fillRect(x-quiet,y-quiet,gridSize+quiet*2,gridSize+quiet*2);
  ctx.fillStyle='#1c2024';
  for(let row=0;row<33;row++){
    for(let col=0;col<33;col++){
      if(bits[row][col]==='1')ctx.fillRect(x+col*cell,y+row*cell,cell,cell);
    }
  }
}
// Arte vertical para Stories. A URL continua exigindo adesivo de link no Instagram.
function prepareStoryShare(){
  if(!window.File||!HTMLCanvasElement.prototype.toBlob)return;
  try{
    const canvas=document.createElement('canvas');
    canvas.width=1080;canvas.height=1920;
    const ctx=canvas.getContext('2d');if(!ctx)return;
    const W=1080,H=1920;
    const background=ctx.createLinearGradient(0,0,W,H);
    background.addColorStop(0,'#1c2024');
    background.addColorStop(.65,'#17191d');
    background.addColorStop(1,'#351b22');
    ctx.fillStyle=background;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#D11F28';ctx.fillRect(0,0,W,26);
    ctx.fillStyle='rgba(209,31,40,.18)';ctx.fillRect(74,148,932,390);
    ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=3;
    ctx.strokeRect(75,149,930,389);
    ctx.textBaseline='alphabetic';
    ctx.textAlign='left';
    ctx.fillStyle='#ffffff';
    ctx.font='800 87px system-ui, sans-serif';ctx.fillText('MARATONA',118,312);
    ctx.font='900 117px system-ui, sans-serif';ctx.fillText('MARVEL.',114,450);
    // Ícone de película cinematográfica simples.
    ctx.strokeStyle='#ffda76';ctx.lineWidth=8;
    ctx.strokeRect(120,618,840,148);ctx.lineWidth=6;
    for(let x=146;x<936;x+=92){
      ctx.strokeRect(x,634,42,26);
      ctx.strokeRect(x,724,42,26);
    }
    ctx.beginPath();ctx.moveTo(120,692);ctx.lineTo(960,692);ctx.stroke();
    ctx.textAlign='center';
    ctx.fillStyle='#f8dba1';ctx.font='600 32px system-ui, sans-serif';
    ctx.fillText('MCU  ·  X-MEN  ·  HOMEM-ARANHA  ·  DEADPOOL',540,857);
    ctx.fillStyle='#ffdb77';ctx.font='900 126px system-ui, sans-serif';
    ctx.fillText('70 FILMES.',540,995);
    ctx.fillStyle='#ffffff';ctx.font='700 65px system-ui, sans-serif';
    ctx.fillText('QUANTOS VOCÊ',540,1103);
    ctx.font='900 106px system-ui, sans-serif';ctx.fillText('JÁ VIU?',540,1218);
    ctx.fillStyle='#f2e5e5';ctx.font='500 38px system-ui, sans-serif';
    ctx.fillText('Uma lista interativa para organizar sua maratona.',540,1296);
    ctx.fillText('Marque os filmes e acompanhe o progresso.',540,1345);
    // QR real com zona de silêncio de 4 módulos; permite abrir o guia sem digitar.
    drawStoryQR(ctx);
    ctx.fillStyle='#ffffff';ctx.font='650 34px system-ui, sans-serif';
    ctx.fillText('ESCANEIE O QR CODE PARA ABRIR A LISTA',540,1696);
    ctx.fillStyle='#ffdb77';ctx.font='550 31px system-ui, sans-serif';
    ctx.fillText('michaelfdias.github.io/maratona-marvel/',540,1766);
    ctx.fillStyle='rgba(255,255,255,.67)';ctx.font='500 29px system-ui, sans-serif';
    ctx.fillText('Guia de organização · Não é serviço de streaming',540,1829);
    canvas.toBlob(blob=>{
      if(blob)storyShareFile=new File([blob],'maratona-marvel-story.png',{type:'image/png'});
    },'image/png');
  }catch(error){storyShareFile=null}
}
prepareStoryShare();

async function copyShareLink(){
  try{
    if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(shareUrl);return true}
  }catch(error){}
  const textArea=document.createElement('textarea');
  textArea.value=shareUrl;
  textArea.setAttribute('readonly','');
  textArea.style.cssText='position:fixed;left:-9999px;top:0;opacity:0';
  document.body.appendChild(textArea);textArea.select();
  let copied=false;
  try{copied=document.execCommand('copy')}catch(error){}
  textArea.remove();
  return copied;
}

// Copia o endereço no mesmo gesto que abre a folha nativa do SO.
// Sem await: a Web Share API e o Safari exigem ativação direta do usuário.
function copyStoryLinkSynchronously(){
  const field=document.createElement('textarea');
  field.value=shareUrl;
  field.setAttribute('readonly','');
  field.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;font-size:16px';
  document.body.appendChild(field);
  field.focus({preventScroll:true});
  field.select();
  field.setSelectionRange(0,shareUrl.length);
  let copied=false;
  try{copied=document.execCommand('copy')}catch(error){}
  field.remove();
  return copied;
}

shareButton.addEventListener('click',()=>{
  shareStatus.textContent='';
  if(typeof navigator.share==='function'){
    const copied=copyStoryLinkSynchronously();
    const files=storyShareFile?[storyShareFile]:[];
    const supportsFile=files.length>0&&typeof navigator.canShare==='function'&&navigator.canShare({files});
    const data={title:'Maratona Marvel',text:shareText,url:shareUrl};
    if(supportsFile)data.files=files;
    // Abre o menu nativo imediatamente; copiar o URL não insere o sticker automaticamente.
    try{
      navigator.share(data).then(()=>{
        shareStatus.textContent=copied
          ?'Link copiado! No Instagram Stories, use Adesivos → Link → Colar.'
          :'No Instagram Stories, use Adesivos → Link e informe o endereço do site.';
      }).catch(error=>{
        if(error?.name!=='AbortError'){
          shareStatus.textContent=copied
            ?'Não foi possível compartilhar; o link está copiado.'
            :'Não foi possível compartilhar. Tente novamente.';
        }
      });
    }catch(error){
      shareStatus.textContent=copied?'Link copiado para compartilhar.':'Não foi possível compartilhar neste navegador.';
    }
    return;
  }
  // Navegadores sem Web Share usam cópia direta, sem abrir outro menu.
  copyShareLink().then(copied=>{
    shareStatus.textContent=copied?'Link copiado para compartilhar!':'Copie este endereço: '+shareUrl;
  });
});

})();
