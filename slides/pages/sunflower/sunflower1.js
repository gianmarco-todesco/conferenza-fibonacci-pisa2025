import {Slide, two, center} from '../../libs/gmtlib.js';   

function subtract(a,b) {
    return {x: a.x - b.x, y: a.y - b.y};
}
function norm(p) {
    return Math.sqrt(p.x*p.x + p.y*p.y);
}
function normalize(p) {
    let norm = Math.sqrt(p.x*p.x + p.y*p.y);
    return {x: p.x / norm, y: p.y / norm};
}
function dot(u,v) {
    return u.x * v.x + u.y * v.y;
}   
function getAngle(u, v) {
    let x = dot(u,v);
    let y = dot(u, {x:-v.y,y:v.x});
    return Math.atan2(y,x);
}
function getDistance(a,b) {
    return norm( subtract(a,b) );
}

function insort(arr, item, compare) {
    if(arr.length === 0 || compare(item, arr[arr.length-1]) > 0) {
        arr.push(item);
    } else if(compare(item, arr[0]) < 0) {  
        arr.splice(0,0,item);
    } else {    
        let lo = 0, hi = arr.length;
        while(lo < hi) {
            let mid = (lo + hi) >>> 1;
            if(compare(item, arr[mid]) < 0) hi = mid;
            else lo = mid + 1;
        }
        arr.splice(lo, 0, item);
    }   
    return arr;
}


class SunFlower1 extends Slide {
    constructor() {
        super("SunFlower");
        this.dtheta = 1/3;
        
    }  

    makeGun() {
        let gunGroup = this.gunGroup = two.makeGroup();
        
        let gun = two.makeCircle(0,0, 8);
        gun.fill = 'yellow';
        gun.stroke = 'orange';
        gun.linewidth = 4;
        gunGroup.add(gun);
        let rect = two.makeRectangle(12,0, 10,4);
        rect.fill = 'orange';
        rect.stroke = 'none';
        gunGroup.add(rect);
        this.mainGroup.add(gunGroup);
    }

    start() {
        this.mainGroup = two.makeGroup();
        this.mainGroup.position.set(center.x,center.y);
        this.makeGun();


        let balls = this.balls = [];
        let t = 0;
    
        let theta = this.theta = 0.0;
        let dtheta = this.dtheta = 2*Math.PI / 3;
        let theta1 = this.theta1 = theta + dtheta;
        const r0 = this.r0 = 18.0;
        this.ticker = this.update.bind(this);
        const me = this;
        gsap.ticker.add( (time, deltaTime) => { 
            me.update(time, deltaTime); 
        } );
        //gsap.ticker.add( (time, deltaTime) => {
        //    
        //});
    }
    async end() {
    }

    set alpha(alpha) {
        this._alpha = alpha;
        this.balls.forEach( b=>b.remove());
        this.balls = [];
        this.dtheta = alpha * Math.PI * 2.0;
        this.theta = 0.0;
        this.theta1 = this.theta + this.dtheta;
    }
    get angleIncrement() {
        return this._alpha;
    }

    fire(time) {
        t = time;
        let phi = this.theta1;
        
        this.theta1 += this.dtheta;
        let cs = Math.cos(phi);
        let sn = Math.sin(phi);
        const r0 = this.r0;
        let ball = two.makeCircle(cs*r0, sn*r0, 3);
        ball.fill = 'white';
        ball.stroke = 'yellow';
        ball.linewidth = 1;
        ball.userData = {
            cs,sn,t:time
        };
        this.balls.push(ball);
    }

    update(time, deltaTime) {
        this.balls.forEach( b => {
            let age = time - b.userData.t;
            let cs = b.userData.cs;
            let sn = b.userData.sn;
            let r = this.r0 + Math.sqrt(age) * 20;
            b.position.x = center.x + cs * r;
            b.position.y = center.y + sn * r;
        });
        this.theta += 0.005 * deltaTime;
        if(this.theta > this.theta1 && this.balls.length  < 5000) {
            this.fire(time);
        }
        this.gunGroup.rotation = this.theta;
    }

    onKeyDown(event) {
        if(event.key === '0') {

        } else if(event.key === '1') {
           this.alpha = 1/3
        } else if(event.key === '2') {
           this.alpha = 1/4            
        } else if(event.key === '3') {
           this.alpha = 3/7            
        } else if(event.key === '4') {
           this.alpha = 10/37        
        
        } else if(event.key === '5') {
           this.alpha = Math.PI       
        }
    }
    nextAct() {
        this.foo(this.index);
        this.index--;
    }
}

let t = new SunFlower1();

