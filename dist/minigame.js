export const TIMING_SPEED={photo:1.3,fish:1.55};
export class TimingGame {
 constructor(type,now=0){this.type=type;this.n=0;this.completed=false;this.start=now;this.lastPress=-Infinity;this.attempt=0;}
 position(now){return (Math.sin(Math.max(0,now-this.start)/1000*TIMING_SPEED[this.type]-Math.PI/2)+1)/2;}
 press(now){if(this.completed||now-this.lastPress<180)return {ignored:true};this.lastPress=now;const pos=this.position(now);const success=pos>=.43&&pos<=.59;this.attempt++;this.start=now; // Every result starts a fresh, independent attempt.
 if(success){this.n++;if(this.type==='photo'&&this.n===3)this.completed=true;}
 return {success,completed:this.completed,n:this.n,attempt:this.attempt};}
}
