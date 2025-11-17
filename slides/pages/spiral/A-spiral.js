import {Slide, two, center} from '../../libs/gmtlib.js';   

const sqrt_2 = Math.sqrt(2);

class Rect {
    constructor(x,y,lx,ly) {
        this.x = x;
        this.y = y;
        this.lx = lx;
        this.ly = ly;   
    }
    topLeft() { return { x:this.x - this.lx/2, y:this.y - this.ly/2};  }
    topRight() { return { x:this.x + this.lx/2, y:this.y - this.ly/2};  }
    bottomLeft() { return { x:this.x - this.lx/2, y:this.y + this.ly/2};  }
    bottomRight() { return { x:this.x + this.lx/2, y:this.y + this.ly/2};  }
}

function intersectLines(p0, p1, p2, p3) {
    let a1 = p1.y - p0.y;
    let b1 = p0.x - p1.x;
    let c1 = a1 * p0.x + b1 * p0.y; 
    let a2 = p3.y - p2.y;

    let b2 = p2.x - p3.x;

    let c2 = a2 * p2.x + b2 * p2.y;
    let det = a1 * b2 - a2 * b1;

    if(det == 0) {
        return null;
    } else {
        let x = (b2 * c1 - b1 * c2) / det;
        let y = (a1 * c2 - a2 * c1) / det;
        return {x:x, y:y};
    }
}

function subractInPlace(p1, p2) {
    p1.x -= p2.x;
    p1.y -= p2.y;   
}

class ASpiral extends Slide {
    constructor() {
        super("GoldenSpiral");
        this._makeRectsData();
        this._center = {x:0,y:0};
        this._scale = 1;
        this._spiralRange = [0,1];
    }   

    _makeRectsData() {
        let rects = this.rects = [];
        let size = 1;
        let x = 0, y = 0;
        let lx = size * sqrt_2, ly = size;
        let dx = -lx, dy = -ly/2;
        let m = 30;
        for(let i=0;i<m;i++) {
            x += dx;
            y += dy;
            if(i%2==0) ly *= 2;
            else lx *= 2;
            [dx,dy] = [ -dy * sqrt_2, dx* sqrt_2];
            rects.push(new Rect(x,y,lx,ly));
        }
        let p0 = this.rects[this.rects.length - 1].topLeft();
        let p1 = this.rects[this.rects.length - 3].bottomRight();
        let p2 = this.rects[this.rects.length - 2].bottomLeft();
        let p3 = this.rects[this.rects.length - 4].topRight();
        this._p0 = p0;
        this._p1 = p1;
        this._p2 = p2;
        this._p3 = p3;  
        this._spiralCenter = intersectLines(p0, p1, p2, p3);
        
        for(let r of rects) {
            subractInPlace(r, this._spiralCenter);
        }   
        subractInPlace(this._p0, this._spiralCenter);
        subractInPlace(this._p1, this._spiralCenter);
        subractInPlace(this._p2, this._spiralCenter);
        subractInPlace(this._p3, this._spiralCenter);   
        /*
        let i = rects.length - 1;
        let p0 = rects[i].topLeft();
        let p1 = rects[i-2].bottomRight();


        let line = two.makeLine(x0,y0,x1,y1);
        line.stroke = 'yellow';
        group.add(line);

        x0 = rects[i-1].x0, y0 = rects[i-1].y1;
        x1 = rects[i-3].x1, y1 = rects[i-3].y0;
        line = two.makeLine(x0,y0,x1,y1);
        */

    }
    _makeRectElements() {
        this._center.x = center.x;
        this._center.y = center.y;
        for(let r of this.rects) {
            let rect = two.makeRectangle();
            rect.fill = 'none';
            rect.stroke = 'white';    
            r.rectElement = rect;        
            this.group.add(rect);
        }
    }
    _updateRects() {
        const sc = this._scale;
        const c = this._center;
        for(let r of this.rects) {
            let el = r.rectElement;
            el.position.set(c.x + sc * r.x, c.y + sc * r.y);
            el.width = sc * r.lx;
            el.height = sc * r.ly;            
        }

        

    }

    _updateSpirals() {
        let start = performance.now();
        const p0 = this.rects[0].bottomRight();
        const theta0 = Math.atan2(p0.y,p0.x);
        const r0 = Math.sqrt(p0.x * p0.x + p0.y * p0.y);
        const param =  Math.log(4)/(Math.PI*2);
        const total = Math.PI * 2 * 10;
        const theta_a = theta0 + this._spiralRange[0] * total;

        let maxRadius = two.height / 2;
        let maxRange = Math.log(maxRadius/(r0 * this._scale))/(param*total);
        let uff = Math.min(maxRange, this._spiralRange[1]);

        const theta_b = theta0 + uff * total;

        this.spiral.vertices.forEach((v,i) => {
            let t = 2 * i / this.spiral.vertices.length;
            let side = 1;
            if(t>1) { t = 2-t; side = -1; }

            let theta = theta_a * (1-t) + theta_b * t;
            let r = r0 * Math.exp(param * (theta-theta0) + side*0.05);
            v.x = this._center.x + this._scale * r * Math.cos(theta);
            v.y = this._center.y + this._scale * r * Math.sin(theta);
        });
        console.log("Spiral update time:", performance.now() - start);
        /*
        
        let ball = this.balls[0];
        ball.position.set(c.x + this._scale * p0.x, c.y + this._scale * p0.y);
        for(let i=1;i<this.balls.length;i++) {
            let t = theta0 + (i-1) * 0.1;
            let a = r0 * Math.exp(param * (t-theta0)); // Math.exp(k*Math.PI*2) =
            let x = a * Math.cos(t);
            let y = a * Math.sin(t);
            let ball = this.balls[i];
            ball.position.set(c.x + this._scale * x, c.y + this._scale * y);
        }
        */

    }

    _updateGeometry() {
        this._updateRects();
        this._updateSpirals();
    }

    initialize() {
    }
    start() {

        let group = this.group = two.makeGroup();
        this._makeRectElements();
        let vertices = [];
        for(let i=0; i<500; i++) {
            vertices.push(new Two.Anchor(0,0));
        }
        this.spiral = two.makePath(vertices, false);
        this.spiral.stroke = 'yellow';
        this.spiral.lineWidth = 0.5;
        this.spiral.closed = true;
        this.spiral.curved = true;
        this.spiral.fill = 'orange';

        /*
        this.balls = [];
        for(let i=0;i<100;i++) {
            let circle = two.makeCircle(0,0,3);
            circle.fill = 'none';
            circle.stroke = 'yellow';
            this.balls.push(circle);
            group.add(circle);
        }
            */
        this._updateGeometry();

        /*
        let line = two.makeLine(p0.x + center.x, p0.y + center.y, p1.x + center.x, p1.y + center.y);
        line.stroke = 'yellow';
        group.add(line);
        line = two.makeLine(p2.x + center.x, p2.y + center.y, p3.x + center.x, p3.y + center.y);
        line.stroke = 'blue';
        group.add(line);    
        let p = this._spiralCenter;
        let circle = two.makeCircle(p.x + center.x, p.y + center.y, 5);
        circle.fill = 'none';
        circle.stroke = 'red';
        */
/*
        let size = 5
        let x = center.x, y = center.y;

        let lst = [];   
        let rects = [];     

        let lx = size * sqrt_2, ly = size;
        let dx = -lx, dy = -ly/2;
        for(let i=0;i<10;i++) {
            x += dx;
            y += dy;
            if(i%2==0) ly *= 2;
            else lx *= 2;
            [dx,dy] = [ -dy * sqrt_2, dx* sqrt_2];
            let rect = two.makeRectangle(x, y, lx, ly);
            rect.fill = 'none';
            rect.stroke = 'white';            
            group.add(rect);
            rects.push({x0:x-lx*0.5,y0:y-ly*0.5,x1:x+lx*0.5,y1:y+ly*0.5});
        }
        let i = rects.length - 1;
        let x0 = rects[i].x0, y0 = rects[i].y0;
        let x1 = rects[i-2].x1, y1 = rects[i-2].y1;
        let line = two.makeLine(x0,y0,x1,y1);
        line.stroke = 'yellow';
        group.add(line);

        x0 = rects[i-1].x0, y0 = rects[i-1].y1;
        x1 = rects[i-3].x1, y1 = rects[i-3].y0;
        line = two.makeLine(x0,y0,x1,y1);
        line.stroke = 'blue';
        group.add(line);
*/
    }
    async end() {
        
    }
    onPointerDrag(x,y,dx,dy,event) {
        // this.scale *= Math.exp(dx * 0.01);
        this._spiralRange[1] += dx * 0.001;
        this._updateSpirals();
    }

    set scale(v) {
        if(v<0.01) v*=4.0;
        if(v != this._scale) {
            this._scale = v;
            this._updateGeometry()
        }
    }

    get scale() {
        return this._scale;
    }

}

let t = new ASpiral();

