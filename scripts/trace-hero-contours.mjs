import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: [require.resolve('next/package.json')] }));
const RIDGE_EDGE = [[0,448],[36,455],[60,462],[85,456],[110,474],[135,470],[165,483],[205,480],[235,489],[270,485],[300,497],[330,497],[360,512],[400,519],[440,529],[480,539],[520,548],[560,558],[600,570],[640,583],[680,595],[720,608],[760,625],[800,639],[840,658],[880,663],[920,654],[960,640],[1000,626],[1040,616],[1080,602],[1120,579],[1160,570],[1200,558],[1240,551],[1280,540],[1320,528],[1360,515],[1400,510],[1440,506],[1480,495],[1520,482],[1560,492],[1600,478],[1640,469],[1672,486]];
const TREE_EDGE = [[0,527],[20,527],[36,540],[52,575],[75,566],[105,558],[140,551],[170,574],[200,558],[230,575],[260,574],[285,600],[305,593],[330,577],[350,579],[375,598],[400,605],[425,623],[445,623],[470,611],[490,635],[515,634],[540,644],[565,660],[590,645],[615,665],[645,659],[670,698],[700,665],[720,654],[745,682],[770,682],[790,648],[815,642],[835,659],[858,683],[880,688],[910,683],[940,697],[965,708],[990,675],[1020,699],[1050,707],[1080,682],[1110,684],[1140,719],[1180,720],[1220,716],[1260,694],[1290,693],[1320,715],[1350,709],[1390,727],[1430,748],[1470,733],[1500,738],[1540,762],[1580,767],[1620,771],[1650,789],[1672,791]];

// Trace local image contrast around art-directed guides; output geometry data,
// not another image layer. No photograph region is duplicated by the renderer.
const {data,info:{width,height,channels}}=await sharp('public/images/coorg/conceptual/hero-mist-valley.webp').raw().toBuffer({resolveWithObject:true});
const luminance=new Float32Array(width*height);
for(let i=0;i<luminance.length;i++) luminance[i]=data[i*channels]*.299+data[i*channels+1]*.587+data[i*channels+2]*.114;
function guideAt(points,x){let i=0;while(i<points.length-2&&points[i+1][0]<x)i++;const a=points[i],b=points[i+1];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}
function trace(points,range){
 let prev=new Float64Array(height).fill(Infinity);
 const back=new Int16Array(width*height);
 for(let x=0;x<width;x++){
  const guide=guideAt(points,x), low=Math.max(8,Math.round(guide-range)),high=Math.min(height-9,Math.round(guide+range));
  const current=new Float64Array(height).fill(Infinity);
  for(let y=low;y<=high;y++){
   let above=0,below=0;
   for(let d=1;d<=4;d++){above+=luminance[(y-d)*width+x];below+=luminance[(y+d)*width+x];}
   const contrast=(above-below)/4;
   const cost=-Math.max(-12,contrast)+.0012*(y-guide)**2;
   if(x===0){current[y]=cost;continue;}
   let best=Infinity,bestY=y;
   for(let step=-10;step<=10;step++){
    const py=y+step;if(py<0||py>=height)continue;
    const candidate=prev[py]+Math.abs(step)*.65+step*step*.035;
    if(candidate<best){best=candidate;bestY=py;}
   }
   current[y]=best+cost;back[x*height+y]=bestY;
  }
  prev=current;
 }
 let y=0;for(let i=1;i<height;i++)if(prev[i]<prev[y])y=i;
 const contour=new Array(width);
 for(let x=width-1;x>=0;x--){contour[x]=y;y=back[x*height+y];}
 return contour;
}
const result={width,height,ridge:trace(RIDGE_EDGE,55),trees:trace(TREE_EDGE,70)};
// The foreground occludes the centre of the middle ridge. Carry that hidden
// boundary below the canopy instead of following the foreground's contrast.
for (let x=640;x<1060;x++) {
 const t=Math.min(1,(x-640)/80,(1060-x)/80);
 const blend=t*t*(3-2*t);
 result.ridge[x]=Math.round(result.ridge[x]*(1-blend)+Math.max(result.ridge[x],result.trees[x]+24)*blend);
}
writeFileSync('src/data/hero-contours.json',JSON.stringify(result)+'\n');
console.log(`Traced ${width} columns per edge from the ${width} × ${height} source.`);
