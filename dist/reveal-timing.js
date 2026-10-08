export const REVEAL_DURATION=2400;
export class RevealTiming{
 constructor(now){this.readyAt=now+REVEAL_DURATION;this.consumed=false;this.requested=false;}
 request(now){this.requested=true;return this.ready(now);}
 ready(now){return !this.consumed&&now>=this.readyAt;}
 consume(now){if(!this.ready(now))return false;this.consumed=true;return true;}
}
