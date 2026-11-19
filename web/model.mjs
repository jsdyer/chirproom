export function shifted(trace,index,delay,sign){
  const at=index-delay;
  if(at<0 || at>=trace.length-1)return null;
  const i=Math.floor(at),f=at-i;
  return sign*((1-f)*trace[i]+f*trace[i+1]);
}
export function correlation(x,y) {
  if(x.length<2 || x.length!==y.length) return null;
  const mean=a=>a.reduce((s,v)=>s+v,0)/a.length;
  const mx=mean(x),my=mean(y);
  let xy=0,xx=0,yy=0;
  for(let i=0;i<x.length;i++){const dx=x[i]-mx,dy=y[i]-my;xy+=dx*dy;xx+=dx*dx;yy+=dy*dy;}
  return xx*yy?xy/Math.sqrt(xx*yy):null;
}
