// node balance-sim.js — 코드 변경 뒤 숫자 감각을 빠르게 검증하는 간단한 몬테카를로 시뮬레이터
const events = require("./event-data.js");
const RUNS = 2000;
function randomEvent(phase) {
  const pool = events.filter((event) => event.minimumPhase <= phase), total = pool.reduce((n,event)=>n+event.weight,0);
  let roll=Math.random()*total; return pool.find((event)=>(roll-=event.weight)<=0) || pool[0];
}
function choose(event, energy, strategy, time) {
  if (energy < event.energyCost) return false;
  if (strategy==="random") return Math.random() < .5;
  if (strategy==="conservative") return event.energyCost===1 || event.failureEffect>=12;
  return event.failureEffect + event.rescued*.12 + (time>150?3:0) >= event.energyCost*5.2;
}
function run(strategy) {
  let time=0, next=1, charge=6, energy=5, stability=100, score=0, combo=0, maxCombo=0, ignored=0, slowNext=0;
  while(time<180 && stability>0) {
    const phase=time<60?0:time<120?1:2, gap=phase===0?8:phase===1?6:5;
    time=next;
    while(charge<=time){energy=Math.min(5,energy+1);charge+=6;}
    const event=randomEvent(phase);
    if(choose(event,energy,strategy,time)) {
      energy-=event.energyCost; score+=event.rescued+combo*2; combo++; maxCombo=Math.max(maxCombo,combo);
      stability=Math.min(100,stability+event.stabilityEffect);
      if(event.effect==="instantCharge")energy=Math.min(5,energy+2);
      if(event.effect==="fastCharge")charge=Math.min(charge,time+2.5);
      if(event.effect==="slowSpawn")slowNext=2;
      next+=gap+(slowNext>0?1.3:0); if(slowNext>0)slowNext--;
    } else {
      ignored++; combo=0; stability-=event.failureEffect*(strategy==="random"?1.08:1);
      next+=gap+(slowNext>0?1.3:0); if(slowNext>0)slowNext--;
    }
  }
  const grade=score>=950?"S":score>=700?"A":score>=420?"B":"C";
  return { survived:Math.min(time,180), complete:time>=180&&stability>0, score, maxCombo, ignored, grade };
}
function report(strategy) {
  const results=Array.from({length:RUNS},()=>run(strategy));
  const avg=(key)=>results.reduce((n,row)=>n+row[key],0)/RUNS;
  const completed=results.filter((row)=>row.complete).length/RUNS*100;
  const grades=Object.fromEntries(["S","A","B","C"].map((grade)=>[grade,results.filter((row)=>row.grade===grade).length/RUNS*100]));
  console.log(strategy, { averageSurvival:+avg("survived").toFixed(1), completionRate:+completed.toFixed(1), averageScore:+avg("score").toFixed(1), averageIgnored:+avg("ignored").toFixed(1), grades:Object.fromEntries(Object.entries(grades).map(([k,v])=>[k,+v.toFixed(1)])) });
}
["random","conservative","optimal"].forEach(report);
