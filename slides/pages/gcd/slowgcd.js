import {Slide, two, center} from '../../libs/gmtlib.js';   


function gcd(a,b) {
    if(a<b) [a,b]=[b,a];
    while(b!=0) [a,b]=[b,a%b];
    return a;
}

class Line {
    constructor(a,b) {
        this.a = a;
        this.b = b;
        this.textSpans = [];
        this.countText = null;
        this.braket = null;
    }
}

class SlowGcd extends Slide {
    constructor() {
        super("SlowGcd");
    }   
    initialize() {
    }
    start() {
        let x0 = 200, y = 50;
        let num = 1, den = 2;
        let textStyle = {
            size: 20, family: 'Arial', fill: 'white'
        }
        let group = this.group = two.makeGroup();
        this.leftGroup = two.makeGroup();
        let start = performance.now();
        let lines = [];
        let maxCount = 0;
        let k = 0;
        for(let i=0; i<100; i++) {
            let a = num, b = den;
            let txt = two.makeText(`(${a}, ${b})`, x0, y, textStyle);
            group.add(txt);
            let line = new Line(a,b);   
            line.textSpans.push(txt);
            [a,b] = [b%a, a];   
            let count = 1;
            while(a != 0) {
                let txt2 = two.makeText(` → (${a}, ${b})`, 0, y, textStyle);
                group.add(txt2);
                [a,b] = [b%a, a];
                count++;
                line.textSpans.push(txt2);
            }
            let txt3 = two.makeText(` → ${b}`, 0, y, textStyle);
            group.add(txt3);
            line.textSpans.push(txt3);
            let txt4 = two.makeText(`${count}`, 0, y, textStyle);
            group.add(txt4);
            line.countText = txt4;
            line.count = count;
            lines.push(line);

            y += 80;
            num++;
            if(num >= den) { den++; num = 1; }                
        }
        two.update();
        window.lines = lines;
        let tl = gsap.timeline();
        this.timeline = tl;
        lines.forEach((line, lineIndex) => {
            line.textSpans.forEach(txt => txt.opacity = 0);
            line.countText.opacity = 0;
            
            for(let i=1; i<line.textSpans.length; i++) {
                let x = line.textSpans[i-1].position.x + 
                    line.textSpans[i-1].getBoundingClientRect().width * 0.5 +
                    line.textSpans[i].getBoundingClientRect().width * 0.5 ;
                line.textSpans[i].position.x = x;
            }
            let x0 = line.textSpans[0].position.x - line.textSpans[0].getBoundingClientRect().width * 0.5;
            let i = line.textSpans.length - 1;
            let x1 = line.textSpans[i].position.x + line.textSpans[i].getBoundingClientRect().width * 0.5;
            let y = line.textSpans[0].position.y + line.textSpans[i].getBoundingClientRect().height * 0.5;
            let xc = (x0 + x1) / 2;
            x0 -= 5;
            x1 += 5;
            let polyline = two.makePath(x0, y, x0+5, y+5, xc-5,y+5,
                    xc, y+10, xc+5, y+5,x1-5, y+5, x1, y, true);
            polyline.stroke = 'white';
            polyline.linewidth = 1;
            polyline.fill = 'none';
            polyline.opacity = 0;
            group.add(polyline);
            line.braket = polyline;

            let txt = line.countText;
            txt.position.x = xc;
            txt.position.y = y + 25;
            
            // line.splice(line.length - 1, 0, polyline);
            let line1 = [...line.textSpans, polyline, line.countText];
            tl.to(line1, {opacity: 1, duration: 0.125, stagger: 0.06});
            if(line.count > maxCount) {
                maxCount = line.count;
                tl.to(line.countText, {fill: 'red', duration: 0.5}, 't'+lineIndex);
                tl.to(line.textSpans[0], {fill: 'blue', duration: 0.5}, 't'+lineIndex);
                tl.to({}, { duration: 1 });

                let row = Math.min(3, lineIndex);
                let txt = two.makeText(line.textSpans[0].value, 
                    line.textSpans[0].position.x,
                    50 + 80 * row, 
                    textStyle);
                this.leftGroup.add(txt);
                txt.fill = 'blue';
                txt.opacity = 0;
                tl.to(txt, {opacity:1, duration:0.1});
                tl.to(txt.position, {x:50, y: 50 + k * 30, duration: 0.2}, 'tb'+lineIndex);
                tl.to(line.textSpans[0], {fill: 'white', duration: 0.5}, 'tb'+lineIndex);
                k++;
            }
            if(lineIndex > 2) {
               tl.to(group.position, {y: -80 * (lineIndex-2), duration: 0.5});
            }
            
        });
        two.update();
        console.log("Time:", performance.now() - start);
        window.tl = tl;
    }
    async end() {
    }

    cleanup() {
        if(this.timeline) {
            this.timeline.kill();
            this.timeline = null;
        }
        if(this.group) {
            this.group.remove();
            this.group = null;
            this.leftGroup.remove();
            this.leftGroup = null;
        }

    }

}

let t = new SlowGcd();

