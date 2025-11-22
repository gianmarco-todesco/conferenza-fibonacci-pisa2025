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



class PointGrid {
    constructor(points) {

        let pts = this.pts = points.map((p,i) => {
            let dx = p.x - center.x;
            let dy = p.y - center.y;
            let r = Math.sqrt(dx*dx + dy*dy);
            let theta = Math.atan2(dy, dx);
            if(theta < 0) theta += 2*Math.PI;
            return {x:p.x,y:p.y,index:i, r, theta};
        });
        pts.sort( (a,b) => a.r - b.r );
        for(let i=pts.length-1; i>0; i--) {
            let L = [{j:i-1, d:getDistance(pts[i], pts[i-1])}];            
            let j = i-2;
            while(j >= 0) {
                let d = getDistance(pts[i], pts[j]);
                insort(L, {j,d}, (a,b) => a.d-b.d);
                if(L.length>4) {
                    let maxd = L[L.length-1].d;
                    L.pop();
                    if(pts[i].r - pts[j].r > maxd) break;
                }
                j--;
            }
            let x = pts[i].x, y = pts[i].y;
            let u = normalize( subtract( center, pts[i] ));
            L.forEach( e => {
                e.psi = getAngle( subtract( pts[e.j], pts[i] ), u);
            });
            L.sort((a,b)=>a.psi-b.psi);
            pts[i].neighbors = L;
            
        }
    }



    getSpiralsFamily(r, rmax, j, err = 0.1) {
        const pts = this.pts;
        let index = 0;
        while(index+1<pts.length && pts[index+1].r < r)
            index++;
        let neighbours = pts[index].neighbors;
        if(!(0<=j && j<neighbours.length)) return null;
        let psi = neighbours[j].psi;
        let links = {}
        let selected = new Set();
        let followers = new Set();  
        while(index+1 < pts.length)
        {
            index++;
            let p = pts[index];
            if(p.r > rmax) break;
            let minPsiErr = err;  
            let newPsi = psi;    
            let j = -1;      
            p.neighbors.forEach( e => {
                let dpsi = Math.abs(e.psi - psi);
                if(dpsi < minPsiErr) { minPsiErr = dpsi; newPsi = e.psi; j = e.j; }
            });
            if(j<0) break;
            psi = newPsi;
            links[index] = j;
            selected.add(index);
            selected.add(j);
            followers.add(j);
        }
        let count = 0;
        let spirals = [];
        for(let i of selected) {
            if(!followers.has(i)) {
                let spiral = {};
                let j = i;
                spiral.points = [pts[j]];
                while( links[j] !== undefined ) {
                    j = links[j];
                    spiral.points.push( pts[j] );
                }     
                let theta = Math.atan2(
                    spiral.points[0].y - center.y,
                    spiral.points[1].x - center.x );
                spiral.angle = theta;
                spirals.push(spiral);
            }
        }
        spirals.sort( (a,b) => a.angle - b.angle );
        return spirals; 
    }
}

class SunFlower extends Slide {
    constructor() {
        super("SunFlower");
        this.insort = insort;
    }   
    initialize() {
    }
    start() {
        const dtheta = 2*Math.PI / ((Math.sqrt(5)+1)/2);
        let n = 2000;
        let balls = this.balls = [];
        for(let i=0; i<n; i++) {
            let phi = i * dtheta;
            let r = 12 * Math.sqrt(i);
            let x = center.x + r * Math.cos(phi);
            let y = center.y + r * Math.sin(phi);
            let ball = two.makeCircle(x,y, 3);
            ball.fill = 'white';
            ball.stroke = 'yellow';
            ball.linewidth = 1;
            balls.push(ball);
        }
        let t = performance.now();
        this.grid = new PointGrid(balls.map( b => b.position ));
        console.log("PointGrid time:", performance.now() - t);
        
        
        /*
        let i0 = this.grid.pts.length-1;
        for(let uff=0; uff<200; uff++) {
            let i = this.grid.pts.length-1-uff;
            let p = this.grid.pts[i];
            let z = 3;
            let angle = p.neighbors[z].psi;
            i = p.neighbors[z].j;
            let stroke = [{x: p.x, y: p.y}];
            for(let k=0;k<20;k++) {
                p = this.grid.pts[i];
                stroke.push( {x: p.x, y: p.y} );
                let dist = Math.abs(angle, p.neighbors[0].psi);
                let j = 0;
                for(let jj = 1; jj<p.neighbors.length; jj++) {
                    let d = Math.abs(angle - p.neighbors[jj].psi);
                    if(d < dist) {
                        dist = d;
                        j = jj;
                    }   
                }
                if(dist > 0.1) break;
                angle = p.neighbors[j].psi;
                if(uff==0) console.log("angle=", angle);
                i = p.neighbors[j].j;                
            }
            let vertices = [];
            stroke.forEach( p => {
                vertices.push( new Two.Anchor(p.x, p.y) );
            });
            let path = two.makePath(vertices);
            path.closed = false;
            path.stroke = 'red';
            path.fill = 'none';
            path.linewidth = 2; 

        }
            */

        /*
        gsap.ticker.add( (time, deltaTime) => {
            let d = dtheta + time * 0.01;

            balls.forEach( (b,i) => {
                let phi = i * d;
                let r = 8 * Math.sqrt(i);
                b.position.x = center.x + r * Math.cos(phi);
                b.position.y = center.y + r * Math.sin(phi);
            })
        });
        */
    }

    foo(r, j, err = 0.1) {
        if(this.fooGroup) this.fooGroup.remove();
        let fooGroup = two.makeGroup();
        this.fooGroup = fooGroup;
        let spirals = this.grid.getSpiralsFamily(r, r + 150, j, err);
        if(spirals === null) return;
        let spiralGroups = this.spiralGroups = [];
        let uffa = [];
        spirals.forEach( (spiral,i) => {
            let spiralGroup = two.makeGroup();
            // spiralGroup.opacity = 0;
            fooGroup.add(spiralGroup);
            spiralGroups.push(spiralGroup);
            let vertices = [];
            spiral.points.forEach( p => {
                vertices.push( new Two.Anchor(p.x, p.y) );
            });
            let path = two.makePath(vertices);
            path.closed = false;
            path.stroke = `hsl(${i*360/spirals.length}, 100%, 50%)`;
            path.fill = 'none';
            path.linewidth = 2; 
            spiralGroup.add(path);  
            path.opacity = 0.0;
            uffa.push(path);   
            let j = spiral.points.length - 1;
            let dot = two.makeCircle(
                spiral.points[0].x, spiral.points[0].y, 12);
            dot.fill = "white";
            dot.stroke = 'orange';
            dot.linewidth = 2;
            dot.opacity = 0.0;
            uffa.push(dot);
            spiralGroup.add(dot);
            let label = two.makeText(
                `${i+1}`, 
                spiral.points[0].x, spiral.points[0].y,
            {
                size: 16, family: 'arial',
                alignment: 'center',
                weight: 'bold'
            });
            label.fill = 'black';
            spiralGroup.add(label);
            label.opacity = 0.0;
            uffa.push(label);
        });
        gsap.to(uffa, {
            duration: 1,
            opacity: 1,
            stagger: 0.01,
        }); 
        /*
        let circle = two.makeCircle(center.x, center.y, r);
        circle.fill = 'none';
        circle.stroke = 'black';
        circle.linewidth = 1;
        fooGroup.add(circle);
        */
        /*
        let psi = this.grid.pts[index+1].theta;
        let ii = [index];
        let i = index;
        while(i + 1 < this.grid.pts.length && Math.abs(this.grid.pts[i+1].psi - psi) < err) {
            ii.push(++i);
        }
        i = index;       
        while(i - 1 >=0 && Math.abs(this.grid.pts[i-1].psi - psi) < err) {
            ii.push(--i);
        }
        this.grid.pts.forEach(p=>p.valid = false);
        ii.forEach( i => {
            this.grid.pts[i].valid = true;
            this.grid.pts[i].leader = true;
        });
        ii.forEach( i => {
            let p = this.grid.pts[i];
            p.neighbors.forEach( e => {

                if(!this.grid.pts[e.j].valid) */
    }

    start2() {
        let gunGroup = two.makeGroup();
        let gun = two.makeCircle(0,0, 8);

        gunGroup.position.set(center.x, center.y);
        gun.fill = 'yellow';
        gun.stroke = 'orange';
        gun.linewidth = 4;
        gunGroup.add(gun);
        let rect = two.makeRectangle(12,0, 10,4);
        rect.fill = 'orange';
        rect.stroke = 'none';
        gunGroup.add(rect);
        this.gunGroup = gunGroup;
        let balls = this.balls = [];
        let t = 0;
    
        let theta = 0.0;
        let dtheta = 2*Math.PI / ((Math.sqrt(5)+1)/2);
        let theta1 = theta + dtheta;
        const r0 = 18.0;
        gsap.ticker.add( (time, deltaTime) => {
            balls.forEach( b => {
                let age = time - b.userData.t;
                let cs = b.userData.cs;
                let sn = b.userData.sn;
                let r = r0 + Math.sqrt(age) * 20;
                b.position.x = center.x + cs * r;
                b.position.y = center.y + sn * r;
            });
            theta += 0.05 * deltaTime;
            let fire = false;
            if(theta >= theta1) {
                theta = theta1;
                theta1 += dtheta;
                fire = true;
            }
            gunGroup.rotation = theta;
            
            // two.update();
            if(fire  && balls.length < 5000) {
                
                t = time;
                let phi = gunGroup.rotation;
                let cs = Math.cos(phi);
                let sn = Math.sin(phi);
                let ball = two.makeCircle(
                    center.x + cs*r0, center.y + sn*r0, 3);
                ball.fill = 'white';
                ball.stroke = 'yellow';
                ball.linewidth = 1;
                ball.userData = {
                    cs,sn,t:time
                };
                balls.push(ball);
                // gunGroup.add(ball);
            }
        });
    }
    async end() {
    }


    onKeyDown(event) {
        if(event.key === '0') {

        } else if(event.key === '1') {
            this.foo(100,2,0.1)
        } else if(event.key === '2') {
            this.foo(100,3,0.1)
        } else if(event.key === '3') {
            this.foo(300,0,0.1)
        }
    }
    nextAct() {
        this.foo(this.index);
        this.index--;
    }
}

let t = new SunFlower();

