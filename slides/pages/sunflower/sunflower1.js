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


class SunFlower1 extends Slide {
    constructor() {
        super("SunFlower");
        this.dtheta = 1/3;
        this.ballPeriod = 0.1; // quanti secondi fra due palle successive
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
        this.mainGroup = this.mainGroup;
        this.makeGun();
        this.speed = 0.001;
        this.currentTime = 0.0;


        let balls = this.balls = [];
        let n = 1000;
        for(let i=0;i<n;i++) {
            let ball = two.makeCircle(0,0, 3);
            ball.fill = 'white';
            ball.stroke = 'yellow';
            ball.linewidth = 1;
            ball.userData = {
                t: i * this.ballPeriod
            };
            this.mainGroup.add(ball);
            ball.visible = false;
            balls.push(ball)
        }
        this.alpha = 1/3;
        
        this.r0 = 18.0;
        
        let div = this.div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '400px';
        div.style.height = '400px';
        div.style.top = '50px';
        div.style.left = '50px';
        div.style.fontSize = '60px';
        div.style.color = 'white';
        // div.style.backgroundColor = 'rgba(255,255,255,0.5)';
        document.body.appendChild(div);
        //katex.render("\\alpha = 2\\pi \\frac{1}{3}", div, {
        //    throwOnError: false
        //});
        this.updateAlphaDisplay("\\frac{1}{3}");
        
        // this.mainGroup.scale = 5

    }
    async end() {
    }
    cleanup() {
        this.div.remove();
    }

    updateAlphaDisplay(s) {
        katex.render('\\alpha = 360°' + s, this.div, {
            throwOnError: false
        });
    }

    set alpha(alpha) {
        this._alpha = alpha;
        let dtheta = this.dtheta = alpha * Math.PI * 2.0;
        
        let period = this.ballPeriod;
        this.balls.forEach( (b,i) => {
            b.t = period * i;
            let psi = dtheta * i;
            b.userData.cs = Math.cos(psi);
            b.userData.sn = Math.sin(psi);
        });
        this.theta = 0;
        this.currentTime = 0;
    }
    get alpha() {
        return this._alpha;
    }

    /*
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
        this.mainGroup.add(ball);
        this.balls.push(ball);
    }
        */

    update(time, deltaTime) {
        let currentTime = this.currentTime += this.speed * deltaTime;
        this.balls.forEach( b => {
            let age = currentTime - b.userData.t;
            if(age<0.0) b.visible = false;
            else {
                b.visible = true;
                let cs = b.userData.cs;
                let sn = b.userData.sn;
                if(cs !== undefined) {
                    let r = this.r0 + Math.sqrt(age) * 60;
                    b.position.x = cs * r;
                    b.position.y = sn * r;

                }
            }
        });
        this.theta = currentTime * this.dtheta / this.ballPeriod;
        this.gunGroup.rotation = this.theta;
    }

    onKeyDown(event) {
        if(event.key === '0') {

        } else if(event.key === '1') {
           this.alpha = 1/3
           this.updateAlphaDisplay("\\frac{1}{3}");
        } else if(event.key === '2') {
           this.alpha = 1/4            
           this.updateAlphaDisplay("\\frac{1}{4}"); 
        } else if(event.key === '3') {
           this.alpha = 3/7            
           this.updateAlphaDisplay("\\frac{3}{7}"); 
        } else if(event.key === '4') {
           this.alpha = 10/37        
           this.updateAlphaDisplay("\\frac{10}{37}"); 
        } else if(event.key === '5') {
           this.alpha = 1/Math.PI       
           this.updateAlphaDisplay("\\frac{1}{\\pi}"); 
        } else if(event.key === '6') {
           this.alpha = 2/(1 + Math.sqrt(5))       
           this.updateAlphaDisplay("\\frac{1}{\\phi}"); 
        } else if(event.key == '+') {
            let newSpeed = 5*this.speed;
            gsap.to(this, {speed:newSpeed, duration:1});
        } else if(event.key == '-') {
            let newSpeed = (1/5)*this.speed;
            gsap.to(this, {speed:newSpeed, duration:1});
        }
    }
    nextAct() {
        this.foo(this.index);
        this.index--;
    }
}

let t = new SunFlower1();

