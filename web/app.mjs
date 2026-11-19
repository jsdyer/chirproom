import {el,fmt,options,source,start} from './ui.mjs';
import {shifted,correlation} from './model.mjs';
start(data=>{
  const [han,liv]=data.traces;
  source('hraw',han.source);source('lraw',liv.source);
  options('zoom',[[.28,'Final 280 milliseconds'],[1,'Full one-second extract']],.28);
  const plot=el('plot'), rate=data.rate, delta=()=>Number(el('shift').value)*rate/1000;
  const sign=()=>el('invert').checked?-1:1;
  let context,active;
  function draw(){
    const windowSeconds=Number(el('zoom').value),full=windowSeconds===1;
    const from=full?0:Math.round((-.23-han.startOffset)*rate);
    const n=full?han.trace.length:Math.round(windowSeconds*rate);
    const w=Math.max(250,plot.clientWidth),h=240,dpr=window.devicePixelRatio||1;
    plot.width=w*dpr;plot.height=h*dpr;const ctx=plot.getContext('2d');ctx.scale(dpr,dpr);
    const x=i=>48+i*(w-64)/(n-1),peak=Math.max(...han.trace.map(Math.abs),...liv.trace.map(Math.abs));
    const y=v=>104-v*88/peak;
    ctx.font='12px system-ui';ctx.fillStyle='#355';
    for(const v of [-4,0,4]){ctx.fillText(String(v),13,y(v));ctx.strokeStyle='#d4ddda';ctx.beginPath();ctx.moveTo(48,y(v));ctx.lineTo(w-12,y(v));ctx.stroke();}
    for(const detector of [0,1]){
      ctx.beginPath();ctx.strokeStyle=detector?'#b35327':'#583450';
      let started=false;
      for(let i=0;i<n;i++){const j=from+i,v=detector?shifted(liv.trace,j,delta(),sign()):han.trace[j];
        if(v==null)continue;if(started)ctx.lineTo(x(i),y(v));else ctx.moveTo(x(i),y(v));started=true;}
      ctx.stroke();
    }
    const t0=han.startOffset+from/rate,t1=t0+(n-1)/rate;
    ctx.fillText(fmt(t0*1000,0)+' ms',48,226);ctx.textAlign='right';ctx.fillText(fmt(t1*1000,0)+' ms',w-14,226);
    let a=[],b=[];
    for(let j=0;j<han.trace.length;j++){const t=han.startOffset+j/rate;
      if(t<-.15 || t>.02)continue;const v=shifted(liv.trace,j,delta(),sign());if(v!=null){a.push(han.trace[j]);b.push(v);}}
    el('shiftLabel').textContent=el('shift').value+' ms';
    el('result').textContent='Waveform correlation '+fmt(correlation(a,b),3);
    el('caption').textContent='Time relative to GPS '+data.referenceGPS+' in milliseconds. Correlation uses −150 to +20 ms at both zoom settings.';
  }
  function stop(){if(active){active.stop();active=null;}el('stop').disabled=true;el('audioStatus').textContent='';}
  el('listen').onclick=async()=>{
    try {
      stop();context??=new AudioContext();await context.resume();
      // Resample both input channels to the available browser audio rate.
      const size=context.sampleRate,buf=context.createBuffer(2,size,size);
      const gain=.8/Math.max(...han.trace.map(Math.abs),...liv.trace.map(Math.abs));
      for(let j=0;j<size;j++){const i=j*rate/size;buf.getChannelData(0)[j]=(shifted(han.trace,i,0,1)??0)*gain;buf.getChannelData(1)[j]=(shifted(liv.trace,i,delta(),sign())??0)*gain;}
      const player=context.createBufferSource();player.buffer=buf;player.connect(context.destination);active=player;el('stop').disabled=false;
      player.onended=()=>{if(active===player){active=null;el('stop').disabled=true;el('audioStatus').textContent='Playback complete';}player.disconnect();};
      player.start();el('audioStatus').textContent=' Playing one second';
    }catch{el('audioStatus').textContent='Audio is unavailable in this browser.';}
  };
  el('stop').onclick=stop;el('align').onclick=()=>{stop();el('shift').value='7';el('invert').checked=true;draw();};
  for(const id of ['shift','invert','zoom'])el(id).oninput=()=>{stop();draw();};
  draw();new ResizeObserver(draw).observe(plot);
});
