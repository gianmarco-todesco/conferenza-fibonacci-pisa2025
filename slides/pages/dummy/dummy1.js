import {Slide, two, center} from '../../libs/gmtlib.js';   

class Dummy1Slide extends Slide {
    constructor() {
        super("Dummy1");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup;
        let text = two.makeText('This is the first slide', center.x, center.y, {
            size: 40,
            family: 'Arial',
            fill: 'yellow'
        });
        let sprite = two.makeSprite('/slides/assets/title-bg.jpg')
        // sprite.position.set(70,-50)
        sprite.scale = 2;
        mainGroup.add(text);
        mainGroup.add(sprite);

        
        this.rs = [150,200,250,300];
        this.rs.forEach(r => {
            let circle = two.makeCircle(0,0,r);
            circle.fill = 'none';
            mainGroup.add(circle);
        })

        let pts = this.pts = [];
        let n = 21;

        let dots = this.dots = [];
        let lines = this.lines = [];
        for(let i = 0; i<n; i++) {
            let phi0 = Math.PI*2*i/n;
            for(let j=0;j<4;j++) {
                let r = this.rs[j];
                let phi = phi0 - j * 0.7;
                let x = r * Math.cos(phi);  
                let y = r * Math.sin(phi);
                pts.push({x,y});  
                let dot = two.makeCircle(x,y,5);
                mainGroup.add(dot);
                dots.push(dot);   
                if(j>0) {
                    let p1 = pts[pts.length-2];
                    let p2 = pts[pts.length-1];
                    let line = two.makeLine(p1.x,p1.y,p2.x,p2.y);
                    mainGroup.add(line)
                    lines.push(line);
                }           
            }
        }

    }
    async end() {
    }

    onPointerDown(x,y,event) {
        x -= center.x;
        y -= center.y;
        console.log(x,y,event);

        let minDist = Infinity;
        let k = -1;
        console.log(this.pts.length);
        for(let i=0;i<this.pts;i++) {
            let dx = this.pts[i].x - x;
            let dy = this.pts[i].y - y;
            let d = Math.sqrt(dx*dx+dy*dy);
            console.log(d);
            if(d<minDist) { minDist = d; k = i;}            
        }
        console.log(minDist)
        if(minDist > 10) {
            this.selected = null;
            return;
        }
        this.selected = k;
        this.dots[k].fill = 'red';
    }

}

let dummy1Slide = new Dummy1Slide();

