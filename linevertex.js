//linevertex.js
let originx=80; //origin of coordinate system-x
let originy=180; //origin of coordinate system-y

//simulation parameters
let dt=0.002; //computational time interval to calculate mechanical equillibrium
let beta=2.5;
let gamma=14.5;
let E=200.0; //stretching elasticity
let B0=5.0; //bending elasticity
let Epsilon=0.01;
let L0=40;
let Lg=L0;
let Ldot=1.7;//
let numberofvertex=25;
let ex=12; //visual expansion
let realtimeMax=61;//61
let timeMax=50000; //calculation time for mechanical equillibrium
let m=0;

//Initial arrays
var X=new Array(realtimeMax);
var Y=new Array(realtimeMax);
for (i=0; i<=realtimeMax; i++){
  X[i]=new Array(numberofvertex+1); 
  Y[i]=new Array(numberofvertex+1); 
}
var X1=new Array(numberofvertex+1); //starting point of vector-x
var BX1=new Array(numberofvertex+1); //ending point of vector-x
var Y1=new Array(numberofvertex+1); //starting point of vector-y
var BY1=new Array(numberofvertex+1); //ending point of vector-y

var l=new Array(realtimeMax+1);
var kappastar=new Array(realtimeMax+1);
var phistar=new Array(realtimeMax+1);
for (i=0; i<=realtimeMax; i++){
  l[i]=new Array(numberofvertex+1); 
  kappastar[i]=new Array(numberofvertex+1); 
  phistar[i]=new Array(numberofvertex+1); 
}

//=======GUI set up=========

function setup() {

  textTitle=createP('Line Vertex Model');
  textTitle.position(120,-10);
  textTitle.style('font-size','28px');
  textTitle.style('font-weight','bold');

//  textUsage0=createP('Usage');
//  textUsage0.position(510,1);
//  textUsage0.style('font-size','14px');
//  textUsage1=createP('1. Tune paramters and click "1.Reset": Reset new parameters.');
//  textUsage1.position(520,23);
//  textUsage1.style('font-size','14px');
//  textUsage2=createP('2. Click "2.Calculation": calculate shoot dynamics taking 10-30 sec');
//  textUsage2.position(520,47);
//  textUsage2.style('font-size','14px');
//  textUsage3=createP('3. Click "3.Run": start drawing the results');
//  textUsage3.position(520,72);
//  textUsage3.style('font-size','14px');

  textExplain0=createP('Meaning of parameters');
  textExplain0.position(50,560);
  textExplain0.style('font-size','16px');
  textExplain1=createP('Gravi-sensing &#946: bending strength when shoot aligned horizontally, the effect becomes 0 when shoot aligned vertically.');
  textExplain1.position(60,580);
  textExplain1.style('font-size','16px');
  textExplain2=createP('Curvature-sensing &#947: straightening strength when shoot bend.');
  textExplain2.position(60,600);
  textExplain2.style('font-size','16px');
  textExplain3=createP('Elasto-gravi length &#949(g/B): Relative value of the force competition between bending and gravity.');
  textExplain3.position(60,620);
  textExplain3.style('font-size','16px');
  textExplain4=createP('Initial length L0: Shoot initial length.');
  textExplain4.position(60,640);
  textExplain4.style('font-size','16px');
  textExplain5=createP('Growth rate G: Shoot growth rate affecting both bending and straightening.');
  textExplain5.position(60,660);
  textExplain5.style('font-size','16px');

  textExplain8=createP('Reference');
  textExplain8.position(50,700);
  textExplain8.style('font-size','14px');
  textExplain9=createP('1.Tsugawa S., Sano TG, Shima H., Morita MT., Demura T., (2020) A mathematical model explores the contributions of bending and stretching forces to shoot gravitropism in Arabidopsis. Quant. Plant Biol., 1, E4, 2020.');
  textExplain9.position(60,720);
  textExplain9.style('font-size','14px');
  textExplain10=createP('2.Bastien R., Douady S. and Moulia B., (2014) A unifying modeling of plant shoot gravitropism with an explicit account of the effects of growth. Front. Plant Sci., 5: 136.');
  textExplain10.position(60,740);
  textExplain10.style('font-size','14px');
  textExplain11=createP('3.Chelakkot R. and Mahadevan L., (2017) On the growth and form of shoots. Interface, 14: 20170001.');
  textExplain11.position(60,760);
  textExplain11.style('font-size','14px');
  textExplain12=createP('4.Agostinelli D., Lucantonio A., and Noselli A., and DeSimone A., (2020) Nutations in growing plant shoots: The role of elastic deformations due to gravity loading, J. Mech. Phys. Solids, 136: 103702');
  textExplain12.position(60,780);
  textExplain12.style('font-size','14px');

//  textlabel=createP('=====>>>>>');
//  textlabel.position(165,370);
//  textlabel.style('font-size','18px');
  let cp;
  cp=createCanvas(400, 310);
  cp.position(54,70);

  frameRate(10);
  sliderSetting();
//  ButtonSetting();
  startStop();
}

function draw(){
  beta=2.0+0.1*sliderbeta.value();
  gamma=10.0+0.9*slidergamma.value();
  Epsilon=0.1*sliderEPS.value();
  L0=sliderL0.value();
//  Lg=L0-5+sliderLg.value();
  Ldot=0.7+0.2*sliderLdot.value();

  if(frameCount==1){
  LVMcalculation0();

  background(200);
  strokeWeight(0.1);
  textSize(16);
  text(str('t='), 300, 30);
  text(2*(frameCount-1), 325, 30);
  text(str('min'), 360, 30);
  drawXYaxis();

//	console.log(frameCount-1);
  //draw vertices and lines
  for (i=0; i<=numberofvertex; i++){
    X1[i]=ex*0.5*X[0][i];
    Y1[i]=ex*0.5*Y[0][i];
  }
  for (i=0; i<numberofvertex; i++){
    BX1[i]=X1[i+1];
    BY1[i]=Y1[i+1];
  }
  stroke('rgb(0,255,0)');
  strokeWeight(2); 
  noFill();
  beginShape();
//    curveVertex(originx+X1[0],originy-Y1[0]);
//    for (i=0; i<=numberofvertex; i++){
//    curveVertex(originx+X1[i],originy-Y1[i]);
//    }
//    curveVertex(originx+X1[numberofvertex],originy-Y1[numberofvertex]);
  for (i=0; i<numberofvertex; i++){
    line(originx+X1[i],originy-Y1[i],originx+BX1[i],originy-BY1[i]);
  }
  strokeWeight(5); 
  for (i=0; i<=numberofvertex; i++){
    point(originx+X1[i],originy-Y1[i]);
  }
  endShape();
  fill(0);
  stroke(0);
  strokeWeight(0.1);
  //XY axes 
  function drawXYaxis(){
    strokeWeight(1);
    line(0,originy,400,originy);
    line(originx,0,originx,310);
  }
  }
  if(frameCount>1){
  LVMcalculation();

  background(200);
  strokeWeight(0.1);
  textSize(16);
  text(str('t='), 300, 30);
  text(2*(frameCount-1), 325, 30);
  text(str('min'), 360, 30);
  drawXYaxis();

//	console.log(frameCount-1);
  //draw vertices and lines
  for (i=0; i<=numberofvertex; i++){
    X1[i]=ex*0.5*X[frameCount-1][i];
    Y1[i]=ex*0.5*Y[frameCount-1][i];
//    X1[i]=ex*0.5*x[i];
//    Y1[i]=ex*0.5*y[i];
  }
  for (i=0; i<numberofvertex; i++){
    BX1[i]=X1[i+1];
    BY1[i]=Y1[i+1];
  }
  stroke('rgb(0,255,0)');
  strokeWeight(2); 
  noFill();
  beginShape();
//    curveVertex(originx+X1[0],originy-Y1[0]);
//    for (i=0; i<=numberofvertex; i++){
//    curveVertex(originx+X1[i],originy-Y1[i]);
//    }
//    curveVertex(originx+X1[numberofvertex],originy-Y1[numberofvertex]);
  for (i=0; i<numberofvertex; i++){
    line(originx+X1[i],originy-Y1[i],originx+BX1[i],originy-BY1[i]);
  }
  strokeWeight(5); 
  for (i=0; i<=numberofvertex; i++){
    point(originx+X1[i],originy-Y1[i]);
  }
  endShape();
  fill(0);
  stroke(0);
  strokeWeight(0.1);
  //XY axes 
  function drawXYaxis(){
    strokeWeight(1);
    line(0,originy,400,originy);
    line(originx,0,originx,310);
  }
  }
  
  if(frameCount==realtimeMax)noLoop();
;}

//slider-set
function sliderSetting(){
  let sliderLength='180px';
  let kankaku=25;
  let sliderLeftEnd=305;
  let sliderYposition=420;
  let titleYposition=395;
  let labelLeftEnd=50;

  sliderbeta = createSlider(0, 10, 2.5);
  sliderbeta.position(sliderLeftEnd, sliderYposition);
  sliderbeta.style('width', sliderLength);
  textbeta=createP('Gravi-sensing  &#946');
  textbeta.position(labelLeftEnd,titleYposition);
  textbeta.style('font-size','20px');
  textTitle.style('font-weight','bold');

  slidergamma = createSlider(0, 14, 14);
  slidergamma.position(sliderLeftEnd, sliderYposition+kankaku);
  slidergamma.style('width', sliderLength);
  textgamma=createP('Curvature-sensing &#947');
  textgamma.position(labelLeftEnd,titleYposition+kankaku);
  textgamma.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderEPS = createSlider(1, 6, 3);
  sliderEPS.position(sliderLeftEnd, sliderYposition+kankaku*2);
  sliderEPS.style('width', sliderLength);
  textEPS=createP('Elasto-gravi length &#949(g/B)');
  textEPS.position(labelLeftEnd,titleYposition+kankaku*2);
  textEPS.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderL0= createSlider(20, 40, 30);
  sliderL0.position(sliderLeftEnd, sliderYposition+kankaku*3);
  sliderL0.style('width', sliderLength);
  textL0=createP('Initial length L0');
  textL0.position(labelLeftEnd,titleYposition+kankaku*3);
  textL0.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderLdot= createSlider(1, 8, 2);
  sliderLdot.position(sliderLeftEnd, sliderYposition+kankaku*4);
  sliderLdot.style('width', sliderLength);
  textLdot=createP('Growth rate G');
  textLdot.position(labelLeftEnd,titleYposition+kankaku*4);
  textLdot.style('font-size','20px');
  textTitle.style('font-weight','bold');

//  sliderLg= createSlider(0, 5, 5);
//  sliderLg.position(sliderLeftEnd, sliderYposition+kankaku*5);
//  sliderLg.style('width', sliderLength);
//  textLg=createP('Growth zone length Lg');
//  textLg.position(labelLeftEnd,titleYposition+kankaku*5);
//  textLg.style('font-size','20px');
//  textTitle.style('font-weight','bold');
}

function startStop() {
  noLoop();
  button1 = createButton('1.Reset');
  button1.position(66, 390);
  button1.mousePressed(reset);

//  button2 = createButton('2.Calculation(10-30sec)');
//  button2.position(136, 390);
//  button2.mousePressed(TText);

  button3 = createButton('2.Run');
  button3.position(136, 390);
  button3.mousePressed(start);

  button = createButton('3.Stop');
  button.position(196, 390);
  button.mousePressed(stop);

  function start() {
    loop();
  }
  function stop() {
    noLoop();
  }
  function reset() {
    frameCount=0;
    clear();
    beta=2.0+0.1*sliderbeta.value();
    gamma=10.0+0.9*slidergamma.value();
    Epsilon=0.1*sliderEPS.value();
    L0=sliderL0.value();
//    Lg=L0-5+sliderLg.value();
    Ldot=0.7+0.2*sliderLdot.value();
    LVMcalculation0();
    background(200);
    strokeWeight(0.1);
    textSize(16);
    text(str('t='), 300, 30);
    text(frameCount, 325, 30);
    text(str('min'), 360, 30);
    drawXYaxis();
    for (i=0; i<=numberofvertex; i++){
      X1[i]=ex*0.5*X[0][i];
      Y1[i]=ex*0.5*Y[0][i];
    }
    for (i=0; i<numberofvertex; i++){
      BX1[i]=X1[i+1];
      BY1[i]=Y1[i+1];
    }
    stroke('rgb(0,255,0)');
    strokeWeight(2); 
    noFill();
    beginShape();
//      curveVertex(originx+X1[0],originy-Y1[0]);
//      for (i=0; i<=numberofvertex; i++){
//        curveVertex(originx+X1[i],originy-Y1[i]);
//      }
//      curveVertex(originx+X1[numberofvertex],originy-Y1[numberofvertex]);
  for (i=0; i<numberofvertex; i++){
    line(originx+X1[i],originy-Y1[i],originx+BX1[i],originy-BY1[i]);
  }
  strokeWeight(5); 
  for (i=0; i<=numberofvertex; i++){
    point(originx+X1[i],originy-Y1[i]);
  }
    endShape();
    fill(0);
//  for (i=0; i<numberofvertex; i++){
//    line(originx+X1[i],originy-Y1[i],originx+BX1[i],originy-BY1[i]);
//  }
//  strokeWeight(12); 
//  for (i=0; i<=numberofvertex; i++){
//    point(originx+X1[i],originy-Y1[i]);
//  }
    stroke(0);
    strokeWeight(0.1);
    //XY axes 
    function drawXYaxis(){
      strokeWeight(1);
      line(0,originy,400,originy);
      line(originx,0,originx,310);
    }
  }//function resetの終わり
  function calculation() {
    LVMcalculation();
//    textSize(20);
//    text(str('Run!'), 330, 300);
  }
}

function LVMcalculation0(){
for (i=0; i<=numberofvertex; i++){
  X[0][i]=L0*i*1.0/(numberofvertex*1.0);
  Y[0][i]=0.0;
}//i-end
for(i=0;i<numberofvertex;i++){
	l[0][i]=L0/(numberofvertex*1.0);
}
for(i=0;i<numberofvertex-1;i++){
	kappastar[0][i]=0.0;
	phistar[0][i]=0.0;
}
}

function TText(){
  textSize(20);
  text(str('In progress...'), 195, 300);
}

function LVMcalculation(){
//console.log(frameCount-2);

let Nm=numberofvertex;
let eta=1.0; //friction coeffcient
let diameter=0.001; //0.001m=1mm
let r=0.5*diameter; //radius=0.5mm
let Gdt=Ldot*dt;
let le=L0*0.001/Epsilon;
let rhog=Math.PI*r*r*B0/(le*le*le);
//console.log(rhog);

//Calculation of mechanical equillibrium
let	Uex,Uey,Ubx,Uby,Udx,Udy;
var x0=new Array(Nm+1);
var y0=new Array(Nm+1);
var x=new Array(Nm+1);
var y=new Array(Nm+1);
var x1=new Array(Nm+1);
var y1=new Array(Nm+1);
var bx=new Array(Nm+1);
var by=new Array(Nm+1);
var theta=new Array(Nm+1);
var kappa=new Array(Nm+1);
var phi=new Array(Nm+1);
var Fex=new Array(Nm+1);
var Fey=new Array(Nm+1);
var Fbx=new Array(Nm+1);
var Fby=new Array(Nm+1);
var Fdx=new Array(Nm+1);
var Fdy=new Array(Nm+1);

//console.log(l,kappastar,phistar);


x[0]=0.0;
y[0]=0.0;
for(i=1;i<=Nm;i++){
	x[i]=X[frameCount-2][i];
	y[i]=Y[frameCount-2][i]; 
}
//	console.log(frameCount,x,y);
for(i=0;i<Nm;i++){
	bx[i]=x[i+1]-x[i];
	by[i]=y[i+1]-y[i];
	theta[i]=Math.PI/2.0-Math.atan2(by[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]),bx[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]));
}
//	console.log(frameCount,bx,by);
for(i=0;i<Nm-1;i++){
	kappa[i]=(theta[i+1]-theta[i])/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
	phi[i]=kappa[i]*l[frameCount-2][i];
}
let dis1,dis2,dis3,dis4;
let ui1x,ui1y,uim1x,uim1y,uip1x,uip1y,uimm1x,uimm1y;
let betai,betami,betammi,betaia,betamia,betammia;
let Aix,Amix,Bix,Bmix,Aiy,Amiy,Biy,Bmiy;

//Line Vertex Model - main
for(let n=0;n<timeMax;n++){//Calculation of mechanical equillibrium
	//stretching force
	for(i=1;i<Nm;i++){
		uim1x=bx[i-1]/Math.sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
		uim1y=by[i-1]/Math.sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
		ui1x=bx[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
		ui1y=by[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
		dis1=Math.sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
		dis2=Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
		Fex[i]=-E*((dis1-l[frameCount-2][i-1])*uim1x-(dis2-l[frameCount-2][i])*ui1x);
		Fey[i]=-E*((dis1-l[frameCount-2][i-1])*uim1y-(dis2-l[frameCount-2][i])*ui1y);
	}
	uim1x=bx[Nm-1]/Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	uim1y=by[Nm-1]/Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	dis1=Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	Fex[Nm]=-E*((dis1-l[frameCount-2][Nm-1])*uim1x);
	Fey[Nm]=-E*((dis1-l[frameCount-2][Nm-1])*uim1y);
//console.log(Fex,Fey,l[frameCount-2]);

	//bending force
	bminx=1.0;
	bminy=0.0;
	uimm1x=bminx/Math.sqrt(bminx*bminx+bminy*bminy);
	uimm1y=bminy/Math.sqrt(bminx*bminx+bminy*bminy);
	uim1x=bx[0]/Math.sqrt(bx[0]*bx[0]+by[0]*by[0]);
	uim1y=by[0]/Math.sqrt(bx[0]*bx[0]+by[0]*by[0]);
	ui1x=bx[1]/Math.sqrt(bx[1]*bx[1]+by[1]*by[1]);
	ui1y=by[1]/Math.sqrt(bx[1]*bx[1]+by[1]*by[1]);
	uip1x=bx[2]/Math.sqrt(bx[2]*bx[2]+by[2]*by[2]);
	uip1y=by[2]/Math.sqrt(bx[2]*bx[2]+by[2]*by[2]);
	betai=phi[1];
	betami=phi[0];
	betammi=Math.acos((bminx*bx[0]+bminy*by[0])/(Math.sqrt(bminx*bminx+bminy*bminy)*Math.sqrt(bx[0]*bx[0]+by[0]*by[0])));
	betaia=phistar[frameCount-2][1];
	betamia=phistar[frameCount-2][0];
	betammia=0.0;
	dis3=Math.sqrt(bx[0]*bx[0]+by[0]*by[0]);
	dis4=Math.sqrt(bx[1]*bx[1]+by[1]*by[1]);

	Aix=(uip1x-ui1x*Math.cos(betai))*aD(betai,betaia)/(dis4);
	Aiy=(uip1y-ui1y*Math.cos(betai))*aD(betai,betaia)/(dis4);
	Amix=(ui1x-uim1x*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Amiy=(ui1y-uim1y*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Bix=(uim1x-ui1x*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Biy=(uim1y-ui1y*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/Math.sqrt(bminx*bminx+bminy*bminy);
	Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/Math.sqrt(bminx*bminx+bminy*bminy);

	Fbx[1]=-B0*(Aix-Amix+Bix-Bmix);
	Fby[1]=-B0*(Aiy-Amiy+Biy-Bmiy);
	for(i=2;i<Nm-1;i++){
		uimm1x=bx[i-2]/Math.sqrt(bx[i-2]*bx[i-2]+by[i-2]*by[i-2]);
		uimm1y=by[i-2]/Math.sqrt(bx[i-2]*bx[i-2]+by[i-2]*by[i-2]);
		uim1x=bx[i-1]/Math.sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
		uim1y=by[i-1]/Math.sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
		ui1x=bx[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
		ui1y=by[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
		uip1x=bx[i+1]/Math.sqrt(bx[i+1]*bx[i+1]+by[i+1]*by[i+1]);
		uip1y=by[i+1]/Math.sqrt(bx[i+1]*bx[i+1]+by[i+1]*by[i+1]);
		betai=phi[i];
		betami=phi[i-1];
		betammi=phi[i-2];
		betaia=phistar[frameCount-2][i];
		betamia=phistar[frameCount-2][i-1];
		betammia=phistar[frameCount-2][i-2];
		dis3=Math.sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
		dis4=Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);

		Aix=(uip1x-ui1x*Math.cos(betai))*aD(betai,betaia)/dis4;
		Aiy=(uip1y-ui1y*Math.cos(betai))*aD(betai,betaia)/dis4;
		Amix=(ui1x-uim1x*Math.cos(betami))*aD(betami,betamia)/dis3;
		Amiy=(ui1y-uim1y*Math.cos(betami))*aD(betami,betamia)/dis3;
		Bix=(uim1x-ui1x*Math.cos(betami))*aD(betami,betamia)/dis4;
		Biy=(uim1y-ui1y*Math.cos(betami))*aD(betami,betamia)/dis4;
		Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/dis3;
		Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/dis3;

		Fbx[i]=-B0*(Aix-Amix+Bix-Bmix);
		Fby[i]=-B0*(Aiy-Amiy+Biy-Bmiy);
	}
	uimm1x=bx[Nm-3]/Math.sqrt(bx[Nm-3]*bx[Nm-3]+by[Nm-3]*by[Nm-3]);
	uimm1y=by[Nm-3]/Math.sqrt(bx[Nm-3]*bx[Nm-3]+by[Nm-3]*by[Nm-3]);
	uim1x=bx[Nm-2]/Math.sqrt(bx[Nm-2]*bx[Nm-2]+by[Nm-2]*by[Nm-2]);
	uim1y=by[Nm-2]/Math.sqrt(bx[Nm-2]*bx[Nm-2]+by[Nm-2]*by[Nm-2]);
	ui1x=bx[Nm-1]/Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	ui1y=by[Nm-1]/Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	betami=phi[Nm-2];
	betammi=phi[Nm-3];
	betamia=phistar[frameCount-2][Nm-2];
	betammia=phistar[frameCount-2][Nm-3];
	dis3=Math.sqrt(bx[Nm-2]*bx[Nm-2]+by[Nm-2]*by[Nm-2]);
	dis4=Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);

	Amix=(ui1x-uim1x*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Amiy=(ui1y-uim1y*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Bix=(uim1x-ui1x*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Biy=(uim1y-ui1y*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Fbx[Nm-1]=-B0*(-Amix+Bix-Bmix);
	Fby[Nm-1]=-B0*(-Amiy+Biy-Bmiy);

	uimm1x=bx[Nm-2]/Math.sqrt(bx[Nm-2]*bx[Nm-2]+by[Nm-2]*by[Nm-2]);
	uimm1y=by[Nm-2]/Math.sqrt(bx[Nm-2]*bx[Nm-2]+by[Nm-2]*by[Nm-2]);
	uim1x=bx[Nm-1]/Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	uim1y=by[Nm-1]/Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);
	betammi=phi[Nm-2];
	betammia=phistar[frameCount-2][Nm-2];
	dis3=Math.sqrt(bx[Nm-1]*bx[Nm-1]+by[Nm-1]*by[Nm-1]);

	Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Fbx[Nm]=-B0*(-Bmix);
	Fby[Nm]=-B0*(-Bmiy);

	for(i=1;i<=Nm;i++){
		Fdx[i]=0.0;
		Fdy[i]=-rhog*sqrt(bx[i-1]*bx[i-1]+by[i-1]*by[i-1]);
	}
	if(n==0){
		x[0]=0.0;
		y[0]=0.0;
		for(i=1;i<=Nm;i++){
			x1[i]=x[i]+(Fex[i]+Fbx[i]+Fdx[i])*dt;
			y1[i]=y[i]+(Fey[i]+Fby[i]+Fdy[i])*dt;
			x0[i]=x[i];
			y0[i]=y[i];
			x[i]=x1[i];
			y[i]=y1[i];
		}
	}
	if(n>0){
		x[0]=0.0;
		y[0]=0.0;
		for(i=1;i<=Nm;i++){
			x1[i]=(2.0-eta)*x[i]-(1.0-eta)*x0[i]+(Fex[i]+Fbx[i]+Fdx[i])*dt;
			y1[i]=(2.0-eta)*y[i]-(1.0-eta)*y0[i]+(Fey[i]+Fby[i]+Fdy[i])*dt;
			x0[i]=x[i];
			y0[i]=y[i];
			x[i]=x1[i];
			y[i]=y1[i];
		}
	}
	//Renewal of natural length and intrinsic curvature
	for(i=0;i<Nm;i++){
		bx[i]=x[i+1]-x[i];
		by[i]=y[i+1]-y[i];
	}
	let L=0.0;
	for(i=0;i<Nm;i++){
		L=L+Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
	}
	for(i=0;i<Nm;i++){
		theta[i]=Math.PI/2.0-Math.atan2(by[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]),bx[i]/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]));
	}
	for(i=0;i<Nm-1;i++){
		kappa[i]=(theta[i+1]-theta[i])/Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
		phi[i]=kappa[i]*Math.sqrt(bx[i]*bx[i]+by[i]*by[i]);
	}
	if(n==timeMax-1){
		let z=(int)(Nm*(L-Lg)/L);
		for(i=0;i<Nm;i++){
			if(i<=z)l[frameCount-1][i]=l[frameCount-2][i];
			if(i>z)l[frameCount-1][i]=l[frameCount-2][i]+Gdt;
		}
		for(i=0;i<Nm-1;i++){
			if(i<=z){
				phistar[frameCount-1][i]=0.0;
				kappastar[frameCount-1][i]=0.0;
			}
			if(i>z){
				kappastar[frameCount-1][i]=kappastar[frameCount-2][i]+Gdt*(-beta*sin(theta[i])-gamma*kappa[i]);
				phistar[frameCount-1][i]=kappastar[frameCount-1][i]*l[frameCount-2][i];
			}
		}
		for(i=0;i<=Nm;i++){
			X[frameCount-1][i]=x[i];
			Y[frameCount-1][i]=y[i];
//			console.log(frameCount, X[frameCount+1],Y[frameCount+1]);
		}
	}
}//n-end
//console.log(frameCount,x,y);

function aD(x,y){ //avoid-0Denominator
	if(Math.abs(x)<0.000001){
		return 0.0;
	}
	if(0.000001<=Math.abs(x) && Math.abs(x)<0.0001){
		return (x-y)/x;
	}
	if(Math.abs(x)>=0.0001){
		return (x-y)/Math.sin(x);
	}
}

}
