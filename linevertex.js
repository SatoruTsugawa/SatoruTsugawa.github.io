//linevertex.js
let originx=80; //origin of coordinate system-x
let originy=180; //origin of coordinate system-y

//simulation parameters
let beta=2.5;
let gamma=14.5;
let B0=37;
let Epsilon=0.01;
let L0=40;
let Lg=40;
let Ldot=1.7;
let numberofvertex=8;
let ex=12; //visual expansion
let realtimeMax=61;
let timeMax=40000; //calculation time for mechanical equillibrium

//Initial arrays
var X=new Array(realtimeMax);
var Y=new Array(realtimeMax);
for (i=0; i<=realtimeMax; i++){
  X[i]=new Array(numberofvertex+1); 
  Y[i]=new Array(numberofvertex+1); 
}
var X1=new Array(100); //starting point of vector-x
var BX1=new Array(100); //ending point of vector-x
var Y1=new Array(100); //starting point of vector-y
var BY1=new Array(100); //ending point of vector-y

//=======GUI set up=========

function setup() {

  textTitle=createP('Line Vertex Model');
  textTitle.position(120,-10);
  textTitle.style('font-size','28px');
  textTitle.style('font-weight','bold');
//  textlabel=createP('=====>>>>>');
//  textlabel.position(165,370);
//  textlabel.style('font-size','18px');
  let cp;
  cp=createCanvas(400, 310);
  cp.position(54,70);

  LVMcalculation0();

  frameRate(10);
  sliderSetting();
//  ButtonSetting();
  startStop();
}

function draw(){
  beta=0.5*sliderbeta.value();
  gamma=7.0+1.5*slidergamma.value();
  Epsilon=0.01*sliderEPS.value();
  L0=sliderL0.value();
  Lg=L0-5+sliderLg.value();
  Ldot=0.7+0.2*sliderLdot.value();

  background(200);
  strokeWeight(0.1);
  textSize(16);
  text(str('t='), 300, 30);
  text(2*(frameCount-1), 325, 30);
  text(str('min'), 360, 30);
  drawXYaxis();

  //draw vertices and lines
  for (i=0; i<=numberofvertex; i++){
    X1[i]=ex*0.5*X[frameCount-1][i];
    Y1[i]=ex*0.5*Y[frameCount-1][i];
  }
  for (i=0; i<numberofvertex; i++){
    BX1[i]=X1[i+1];
    BY1[i]=Y1[i+1];
  }
  stroke('rgb(0,255,0)');
  strokeWeight(5); // 線の太さ
  for (i=0; i<numberofvertex; i++){
    line(originx+X1[i],originy-Y1[i],originx+BX1[i],originy-BY1[i]);
  }
  strokeWeight(12); // 点の大きさ
  for (i=0; i<=numberofvertex; i++){
    point(originx+X1[i],originy-Y1[i]);
  }
  stroke(0);
  strokeWeight(0.1);
  //XY axes 
  function drawXYaxis(){
    strokeWeight(1);
    line(0,originy,400,originy);
    line(originx,0,originx,310);
  }
  if(frameCount==realtimeMax)noLoop();
}

//slider-set
function sliderSetting(){
  let sliderLength='180px';
  let kankaku=25;
  let sliderLeftEnd=280;
  let sliderYposition=420;
  let titleYposition=395;
  let labelLeftEnd=50;

  sliderbeta = createSlider(2, 8, 5);
  sliderbeta.position(sliderLeftEnd, sliderYposition);
  sliderbeta.style('width', sliderLength);
  textbeta=createP('Gravi-sensing  &#946');
  textbeta.position(labelLeftEnd,titleYposition);
  textbeta.style('font-size','20px');
  textTitle.style('font-weight','bold');

  slidergamma = createSlider(0, 10, 5);
  slidergamma.position(sliderLeftEnd, sliderYposition+kankaku);
  slidergamma.style('width', sliderLength);
  textgamma=createP('Curvature-sensing &#947');
  textgamma.position(labelLeftEnd,titleYposition+kankaku);
  textgamma.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderEPS = createSlider(1, 7, 1);
  sliderEPS.position(sliderLeftEnd, sliderYposition+kankaku*2);
  sliderEPS.style('width', sliderLength);
  textEPS=createP('Elasto-gravi length e');
  textEPS.position(labelLeftEnd,titleYposition+kankaku*2);
  textEPS.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderL0= createSlider(25, 55, 40);
  sliderL0.position(sliderLeftEnd, sliderYposition+kankaku*3);
  sliderL0.style('width', sliderLength);
  textL0=createP('Initial length L0');
  textL0.position(labelLeftEnd,titleYposition+kankaku*3);
  textL0.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderLg= createSlider(0, 5, 5);
  sliderLg.position(sliderLeftEnd, sliderYposition+kankaku*4);
  sliderLg.style('width', sliderLength);
  textLg=createP('Growth zone length Lg');
  textLg.position(labelLeftEnd,titleYposition+kankaku*4);
  textLg.style('font-size','20px');
  textTitle.style('font-weight','bold');

  sliderLdot= createSlider(0, 10, 5);
  sliderLdot.position(sliderLeftEnd, sliderYposition+kankaku*5);
  sliderLdot.style('width', sliderLength);
  textLdot=createP('Growth rate G');
  textLdot.position(labelLeftEnd,titleYposition+kankaku*5);
  textLdot.style('font-size','20px');
  textTitle.style('font-weight','bold');

}

//function ButtonSetting(){
//  button = createButton('calculation!');
//  button.position(65, 390);
//  button.mousePressed(calculation);
//}

function startStop() {
  noLoop();
  button = createButton('Reset');
  button.position(66, 390);
  button.mousePressed(reset);
  button = createButton('Calculation(<30sec)');
  button.position(126, 390);
  button.mousePressed(calculation);
  button = createButton('Run');
  button.position(270, 390);
  button.mousePressed(start);
//  button = createButton('Stop');
//  button.position(310, 390);
//  button.mousePressed(stop);
  function start() {
    loop();
  }
  function stop() {
    noLoop();
  }
  function reset() {
    frameCount=0;
    clear();
    beta=0.5*sliderbeta.value();
    gamma=7.0+1.5*slidergamma.value();
    Epsilon=0.1*sliderEPS.value();
    L0=sliderL0.value();
    Lg=L0-5+sliderLg.value();
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
      X1[i]=ex*0.5*X[frameCount][i];
      Y1[i]=ex*0.5*Y[frameCount][i];
    }
    for (i=0; i<numberofvertex; i++){
      BX1[i]=X1[i+1];
      BY1[i]=Y1[i+1];
    }
    stroke('rgb(0,255,0)');
    strokeWeight(5); // 線の太さ
    for (i=0; i<numberofvertex; i++){
      line(originx+X1[i],originy-Y1[i],originx+BX1[i],originy-BY1[i]);
    }
    strokeWeight(12); // 点の大きさ
    for (i=0; i<=numberofvertex; i++){
      point(originx+X1[i],originy-Y1[i]);
    }
    stroke(0);
    strokeWeight(0.1);
    //XY axes 
    function drawXYaxis(){
      strokeWeight(1);
      line(0,originy,400,originy);
      line(originx,0,originx,310);
    }
  }
  function calculation() {
    LVMcalculation();
    textSize(20);
    text(str('done!'), 330, 300);
  }
}

function LVMcalculation0(){
  for (i=0; i<=numberofvertex; i++){
    X[0][i]=L0*i*1.0/(numberofvertex*1.0);
    Y[0][i]=0.0;
  }//i-end
}


function LVMcalculation(){

let Nm=numberofvertex;
let dt=0.002; //computational time interval to calculate mechanical equillibrium
let E=200.0; //stretching elascicity
let eta=1.0; //friction coeffcient
let diameter=0.001; //0.001m=1mm
let r=0.5*diameter; //radius=0.5mm
let Gdt=Ldot*dt;
let le=L0*0.001/Epsilon;
let rhog=Math.PI*r*r*B0/(le*le*le); //正しい式はl_e=(B*pi*r*r/(rhog))**(1/3)
//console.log(rhog);

//Calculation of mechanical equillibrium
let	Uex,Uey,Ubx,Uby,Udx,Udy;
var x=new Array(timeMax+1);
var y=new Array(timeMax+1);
var bx=new Array(timeMax+1);
var by=new Array(timeMax+1);
var theta=new Array(timeMax+1);
var kappa=new Array(timeMax+1);
var phi=new Array(timeMax+1);
var l=new Array(realtimeMax+1);
var kappastar=new Array(realtimeMax+1);
var phistar=new Array(realtimeMax+1);
var Fex=new Array(Nm+1);
var Fey=new Array(Nm+1);
var Fbx=new Array(Nm+1);
var Fby=new Array(Nm+1);
var Fdx=new Array(Nm+1);
var Fdy=new Array(Nm+1);
for (i=0; i<=timeMax; i++){
  x[i]=new Array(Nm+1); 
  y[i]=new Array(Nm+1); 
  bx[i]=new Array(Nm+1); 
  by[i]=new Array(Nm+1); 
  theta[i]=new Array(Nm+1); 
  kappa[i]=new Array(Nm+1); 
  phi[i]=new Array(Nm+1); 
  Fex[i]=new Array(Nm+1); 
  Fey[i]=new Array(Nm+1); 
  Fbx[i]=new Array(Nm+1); 
  Fby[i]=new Array(Nm+1); 
  Fdx[i]=new Array(Nm+1); 
  Fdy[i]=new Array(Nm+1); 
}
for (i=0; i<=realtimeMax; i++){
  l[i]=new Array(Nm+1); 
  kappastar[i]=new Array(Nm+1); 
  phistar[i]=new Array(Nm+1); 
}

//Line Vertex Model - main
for(let m=0;m<realtimeMax;m++){

for(let n=0;n<timeMax;n++){//Calculation of mechanical equillibrium

x[0][0]=0.0;
y[0][0]=0.0;
for(i=1;i<=Nm;i++){
	x[0][i]=i*L0*1.0/(Nm*1.0);
//	y[0][i]=0.02*Math.sin(0.03*x[0][i]); //to avoid 0 at initial state
	y[0][i]=0.0; //to avoid 0 at initial state
	X[0][i]=x[0][i];
	Y[0][i]=y[0][i];
//	console.log(m,x[0][i],y[0][i]);
}
for(i=0;i<Nm;i++){
	bx[0][i]=x[0][i+1]-x[0][i];
	by[0][i]=y[0][i+1]-y[0][i];
	l[0][i]=L0/(Nm*1.0);
//	let theta1=Math.atan2(by[0][i]/Math.sqrt(bx[0][i]*bx[0][i]+by[0][i]*by[0][i]),bx[0][i]/Math.sqrt(bx[0][i]*bx[0][i]+by[0][i]*by[0][i]));
	theta[0][i]=Math.PI/2.0-Math.atan2(by[0][i]/Math.sqrt(bx[0][i]*bx[0][i]+by[0][i]*by[0][i]),bx[0][i]/Math.sqrt(bx[0][i]*bx[0][i]+by[0][i]*by[0][i]));
//	console.log(i,bx[0][i],l[0][i],theta[0][i],Math.PI/2.0);
}
for(i=0;i<Nm-1;i++){
	kappa[0][i]=(theta[0][i+1]-theta[0][i])/Math.sqrt(bx[0][i]*bx[0][i]+by[0][i]*by[0][i]);
	kappastar[0][i]=0.0;
	phi[0][i]=kappa[0][i]*l[0][i];
	phistar[0][i]=0.0;
//	console.log(m,i,kappastar[0][i]);
}

let dis1,dis2,dis3,dis4;
let ui1x,ui1y,uim1x,uim1y,uip1x,uip1y,uimm1x,uimm1y;
let betai,betami,betammi,betaia,betamia,betammia;
let Aix,Amix,Bix,Bmix,Aiy,Amiy,Biy,Bmiy;
	//stretching force
	Fex[n][0]=0;
	Fey[n][0]=0;
	for(i=1;i<Nm;i++){
		uim1x=bx[n][i-1]/Math.sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
		uim1y=by[n][i-1]/Math.sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
		ui1x=bx[n][i]/Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]);
		ui1y=by[n][i]/Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]);
//		if(n==0)console.log(n,ui1x,ui1y,Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]),bx[n][i]*bx[n][i],by[n][i]*by[n][i]);
//		console.log(bx[0][i],by[0][i]);
		dis1=Math.sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
		dis2=Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]);
		Fex[n][i]=-E*((dis1-l[m][i-1])*uim1x-(dis2-l[m][i])*ui1x);
		Fey[n][i]=-E*((dis1-l[m][i-1])*uim1y-(dis2-l[m][i])*ui1y);
//		console.log(m,n,i,Fex[n][i],Fey[n][i]);
	}
	uim1x=bx[n][Nm-1]/Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	uim1y=by[n][Nm-1]/Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	dis1=Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	Fex[n][Nm]=-E*((dis1-l[m][Nm-1])*uim1x);
	Fey[n][Nm]=-E*((dis1-l[m][Nm-1])*uim1y);
//	console.log(m,n,Fex[n][Nm],Fey[n][Nm]);

	//bending force
	bminx=1.0;
	bminy=0.0;
	uimm1x=bminx/Math.sqrt(bminx*bminx+bminy*bminy);
	uimm1y=bminy/Math.sqrt(bminx*bminx+bminy*bminy);
	uim1x=bx[n][0]/Math.sqrt(bx[n][0]*bx[n][0]+by[n][0]*by[n][0]);
	uim1y=by[n][0]/Math.sqrt(bx[n][0]*bx[n][0]+by[n][0]*by[n][0]);
	ui1x=bx[n][1]/Math.sqrt(bx[n][1]*bx[n][1]+by[n][1]*by[n][1]);
	ui1y=by[n][1]/Math.sqrt(bx[n][1]*bx[n][1]+by[n][1]*by[n][1]);
	uip1x=bx[n][2]/Math.sqrt(bx[n][2]*bx[n][2]+by[n][2]*by[n][2]);
	uip1y=by[n][2]/Math.sqrt(bx[n][2]*bx[n][2]+by[n][2]*by[n][2]);
	betai=phi[n][1];
	betami=phi[n][0];
	betammi=Math.acos((bminx*bx[n][0]+bminy*by[n][0])/(Math.sqrt(bminx*bminx+bminy*bminy)*Math.sqrt(bx[n][0]*bx[n][0]+by[n][0]*by[n][0])));
	betaia=phistar[m][1];
	betamia=phistar[m][0];
	betammia=0.0;
	dis3=Math.sqrt(bx[n][0]*bx[n][0]+by[n][0]*by[n][0]);
	dis4=Math.sqrt(bx[n][1]*bx[n][1]+by[n][1]*by[n][1]);
//	console.log(dis3,dis4);
//	console.log(n,uim1x,uim1y);

	Aix=(uip1x-ui1x*Math.cos(betai))*aD(betai,betaia)/(dis4);
	Aiy=(uip1y-ui1y*Math.cos(betai))*aD(betai,betaia)/(dis4);
	Amix=(ui1x-uim1x*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Amiy=(ui1y-uim1y*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Bix=(uim1x-ui1x*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Biy=(uim1y-ui1y*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/Math.sqrt(bminx*bminx+bminy*bminy);
	Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/Math.sqrt(bminx*bminx+bminy*bminy);

//	Fbx[n][1]=-B0*(Aix-Amix+Bix-Bmix);
//	Fby[n][1]=-B0*(Aiy-Amiy+Biy-Bmiy);
	Fbx[n][1]=-B0*(Aix-Amix+Bix-Bmix);
	Fby[n][1]=-B0*(Aiy-Amiy+Biy-Bmiy);
//	console.log(m,n,Fbx[n][1],Fby[n][1]);
	for(i=2;i<Nm-1;i++){
		uimm1x=bx[n][i-2]/Math.sqrt(bx[n][i-2]*bx[n][i-2]+by[n][i-2]*by[n][i-2]);
		uimm1y=by[n][i-2]/Math.sqrt(bx[n][i-2]*bx[n][i-2]+by[n][i-2]*by[n][i-2]);
		uim1x=bx[n][i-1]/Math.sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
		uim1y=by[n][i-1]/Math.sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
		ui1x=bx[n][i]/Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]);
		ui1y=by[n][i]/Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]);
//		console.log(ui1x,ui1y,Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]),bx[n][i]);
		uip1x=bx[n][i+1]/Math.sqrt(bx[n][i+1]*bx[n][i+1]+by[n][i+1]*by[n][i+1]);
		uip1y=by[n][i+1]/Math.sqrt(bx[n][i+1]*bx[n][i+1]+by[n][i+1]*by[n][i+1]);
		betai=phi[n][i];
		betami=phi[n][i-1];
		betammi=phi[n][i-2];
		betaia=phistar[m][i];
		betamia=phistar[m][i-1];
		betammia=phistar[m][i-2];
		dis3=Math.sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
		dis4=Math.sqrt(bx[n][i]*bx[n][i]+by[n][i]*by[n][i]);

		Aix=(uip1x-ui1x*Math.cos(betai))*aD(betai,betaia)/dis4;
		Aiy=(uip1y-ui1y*Math.cos(betai))*aD(betai,betaia)/dis4;
		Amix=(ui1x-uim1x*Math.cos(betami))*aD(betami,betamia)/dis3;
		Amiy=(ui1y-uim1y*Math.cos(betami))*aD(betami,betamia)/dis3;
		Bix=(uim1x-ui1x*Math.cos(betami))*aD(betami,betamia)/dis4;
		Biy=(uim1y-ui1y*Math.cos(betami))*aD(betami,betamia)/dis4;
		Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/dis3;
		Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/dis3;

		Fbx[n][i]=-B0*(Aix-Amix+Bix-Bmix);
		Fby[n][i]=-B0*(Aiy-Amiy+Biy-Bmiy);
//		if(m==2)console.log(m,n,Fbx[n][i],Fby[n][i],Aix,Amix,Bix,Bmix);
//		if(m==2)console.log(m,n,uimm1x,uim1x,Math.cos(betammi),aD(betammi,betammia),betammi,betammia,dis3);
	}
	uimm1x=bx[n][Nm-3]/Math.sqrt(bx[n][Nm-3]*bx[n][Nm-3]+by[n][Nm-3]*by[n][Nm-3]);
	uimm1y=by[n][Nm-3]/Math.sqrt(bx[n][Nm-3]*bx[n][Nm-3]+by[n][Nm-3]*by[n][Nm-3]);
	uim1x=bx[n][Nm-2]/Math.sqrt(bx[n][Nm-2]*bx[n][Nm-2]+by[n][Nm-2]*by[n][Nm-2]);
	uim1y=by[n][Nm-2]/Math.sqrt(bx[n][Nm-2]*bx[n][Nm-2]+by[n][Nm-2]*by[n][Nm-2]);
	ui1x=bx[n][Nm-1]/Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	ui1y=by[n][Nm-1]/Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	betami=phi[n][Nm-2];
	betammi=phi[n][Nm-3];
	betamia=phistar[m][Nm-2];
	betammia=phistar[m][Nm-3];
	dis3=Math.sqrt(bx[n][Nm-2]*bx[n][Nm-2]+by[n][Nm-2]*by[n][Nm-2]);
	dis4=Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);

	Amix=(ui1x-uim1x*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Amiy=(ui1y-uim1y*Math.cos(betami))*aD(betami,betamia)/(dis3);
	Bix=(uim1x-ui1x*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Biy=(uim1y-ui1y*Math.cos(betami))*aD(betami,betamia)/(dis4);
	Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Fbx[n][Nm-1]=-B0*(-Amix+Bix-Bmix);
	Fby[n][Nm-1]=-B0*(-Amiy+Biy-Bmiy);

	uimm1x=bx[n][Nm-2]/Math.sqrt(bx[n][Nm-2]*bx[n][Nm-2]+by[n][Nm-2]*by[n][Nm-2]);
	uimm1y=by[n][Nm-2]/Math.sqrt(bx[n][Nm-2]*bx[n][Nm-2]+by[n][Nm-2]*by[n][Nm-2]);
	uim1x=bx[n][Nm-1]/Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	uim1y=by[n][Nm-1]/Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);
	betammi=phi[n][Nm-2];
	betammia=phistar[m][Nm-2];
	dis3=Math.sqrt(bx[n][Nm-1]*bx[n][Nm-1]+by[n][Nm-1]*by[n][Nm-1]);

	Bmix=(uimm1x-uim1x*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Bmiy=(uimm1y-uim1y*Math.cos(betammi))*aD(betammi,betammia)/(dis3);
	Fbx[n][Nm]=-B0*(-Bmix);
	Fby[n][Nm]=-B0*(-Bmiy);
//	console.log(m,n,Fbx[n][Nm],Fby[n][Nm]);

	for(i=1;i<=Nm;i++){
		Fdx[n][i]=0.0;
		Fdy[n][i]=-rhog*sqrt(bx[n][i-1]*bx[n][i-1]+by[n][i-1]*by[n][i-1]);
//		console.log(m,n,Fex[n][i],Fey[n][i],Fbx[n][i],Fby[n][i],Fdx[n][i],Fdy[n][i]);
	}
	if(n==0){
		x[n+1][0]=0.0;
		y[n+1][0]=0.0;
		for(i=1;i<=Nm;i++){
			x[n+1][i]=x[n][i]+(Fex[n][i]+Fbx[n][i]+Fdx[n][i])*dt;
			y[n+1][i]=y[n][i]+(Fey[n][i]+Fby[n][i]+Fdy[n][i])*dt;
//			if(m==2)console.log(m,n,x[n+1][i],y[n+1][i],Fex[n][i],Fbx[n][i],Fdy[n][i])
		}
	}
	if(n>0){
		x[n+1][0]=0.0;
		y[n+1][0]=0.0;
		for(i=1;i<=Nm;i++){
			x[n+1][i]=(2.0-eta)*x[n][i]-(1.0-eta)*x[n-1][i]+(Fex[n][i]+Fbx[n][i]+Fdx[n][i])*dt;
			y[n+1][i]=(2.0-eta)*y[n][i]-(1.0-eta)*y[n-1][i]+(Fey[n][i]+Fby[n][i]+Fdy[n][i])*dt;
//			if(m==2)console.log(m,n,x[n+1][i],y[n+1][i],Fex[n][i],Fbx[n][i],Fdy[n][i])
		}
	}
	//Renewal of natural length and intrinsic curvature
	for(i=0;i<Nm;i++){
		bx[n+1][i]=x[n+1][i+1]-x[n+1][i];
		by[n+1][i]=y[n+1][i+1]-y[n+1][i];
//		console.log(bx[n+1][i],by[n+1][i])
	}
	let L=0.0;
	for(i=0;i<Nm;i++){
		L=L+Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]);
	}
	for(i=0;i<Nm;i++){
//		let theta1=Math.atan2(by[n+1][i]/Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]),bx[n+1][i]/Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]));
//		if(theta1>0)theta[n+1][i]=Math.PI/2.0-theta1;
//		if(theta1<0)theta[n+1][i]=Math.PI/2.0-theta1;
		theta[n+1][i]=Math.PI/2.0-Math.atan2(by[n+1][i]/Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]),bx[n+1][i]/Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]));
//		console.log(theta[n+1][i]);
	}
	for(i=0;i<Nm-1;i++){
		kappa[n+1][i]=(theta[n+1][i+1]-theta[n+1][i])/Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]);
		phi[n+1][i]=kappa[n+1][i]*Math.sqrt(bx[n+1][i]*bx[n+1][i]+by[n+1][i]*by[n+1][i]);
	}
	if(n==timeMax-1){
		let z=(int)(Nm*(L-Lg)/L);
//		console.log(m,n,z,L,Lg);
		for(i=0;i<Nm;i++){
			if(i<=z)l[m+1][i]=l[m][i];
			if(i>z)l[m+1][i]=l[m][i]+Gdt;
//			console.log(m,l[m+1][i],l[m][i]);
		}
		for(i=0;i<Nm-1;i++){
			if(i<=z){
				phistar[m+1][i]=0.0;
				kappastar[m+1][i]=0.0;
//				phistar[m+1][i]=kappastar[m][i]*l[m][i];
//				kappastar[m+1][i]=kappastar[m][i];
//				console.log(m,z,i,phistar[m+1][i],kappastar[m][i],l[m][i]);
			}
			if(i>z){
				kappastar[m+1][i]=kappastar[m][i]+Gdt*(-beta*sin(theta[n+1][i])-gamma*kappa[n+1][i]);
				phistar[m+1][i]=kappastar[m+1][i]*l[m][i];
//				console.log(m,z,i,phistar[m+1][i],kappastar[m+1][i],kappastar[m][i],l[m][i]);
			}
		}
		for(i=0;i<=Nm;i++){
			X[m][i]=x[n+1][i];
			Y[m][i]=y[n+1][i];
			console.log(m,n,X[m][i],Y[m][i]);
		}
	}
}//n-end
}//m-end

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
