import {Slide, two, center, TextLine} from '../../libs/gmtlib.js';   

/*
class TextLine {
    constructor(texts, style, margin) {
        this.group = two.makeGroup();
        this.texts = texts.map(t => two.makeText(t, 0, 0, style));
        this.texts.forEach(t => this.group.add(t));        
        this.margin = margin || 50;
    }
    update() {
        two.update();
        let x = 0;
        this.texts.forEach((item)=>{
            let cr = item.getBoundingClientRect();
            item.position.x = x + cr.width/2;
            x += cr.width + this.margin;
        });
    }
}
*/

class FibonacciSumSlide extends Slide {
    constructor() {
        super("FibonacciSum");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup; 

        let line = two.makeGroup();
        mainGroup.add(line);

        let textLines = this.textLines = [];
        
        let div = this.div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = '40px';
        div.style.left = '0px';
        div.style.width = '100%';
        div.style.fontSize = '30px';
        div.style.color = 'white';
        div.style.textAlign = 'center';
        document.body.appendChild(div);
        katex.render(
            "\\sum_{i=1}^{n} F_i = F_1 + F_2 + ... + F_n = ?", 
                div, { throwOnError: false });


        const textSytle = {
            size: 60,
            family: 'Arial',
            fill: 'white',
            weight: 550
        };
        // Fibonacci numbers
        let fibs = [1,1];
        for(let i=0; i<11; i++) fibs.push(fibs[i]+fibs[i+1]);
        // text line with fibonacci numbers
        let fibTextLine = new TextLine(fibs.map(i => `${i}`), textSytle, 50);
        textLines.push(fibTextLine);
        mainGroup.add(fibTextLine.group);
        fibTextLine.group.position.set(-800,-200);
        fibTextLine.texts.forEach(t => t.opacity = 0);

        textSytle.size = 40;
        for(let i=3; i<10; i++) {
            let s = 1;
            let ts = ['1'];
            for(let j=1;j<i;j++) { ts.push('+',`${fibs[j]}`); s+=fibs[j]}
            ts.push("=", `${s}`);
            let sumTextLine = new TextLine(ts, textSytle, 10);
            sumTextLine.texts[sumTextLine.texts.length-1].fill = 'orange';
            sumTextLine.texts.forEach(t => t.opacity = 0);
            textLines.push(sumTextLine);
            mainGroup.add(sumTextLine.group);
            sumTextLine.group.position.set(
                fibTextLine.group.position.x, 
                -150 + (i-2)*60);
        }

        this.highlightItems = [];
        for(let i=0; i<2;i++) {
            let rect = two.makeRectangle(0,0,10,10);
            rect.fill = 'none';
            rect.stroke = 'red';
            rect.linewidth = 4;
            rect.visible = false;
            this.mainGroup.add(rect);
            this.highlightItems.push(rect);
        }
        let circle = two.makeCircle(0,0,40);
        circle.fill = 'none';
        circle.stroke = 'orange';
        circle.linewidth = 4;
        circle.visible = false;
        this.mainGroup.add(circle);
        this.highlightItems.push(circle);


        two.update(); // per ottenere le dimensioni
        textLines.forEach(tl => tl.update());

        
        let tl = gsap.timeline();
        textLines.forEach((textLine,i)=>{
            tl.to(textLine.texts, {opacity:1, duration:0.3, stagger:0.1}, i*0.5);
        });
        
        // textLines.forEach(textLine => { textLine.texts.forEach(t => t.opacity=1); });
    }
    cleanup() {
        this.mainGroup.remove();
        this.div.remove();
    }

    setHighlightingRect(rect, textLine, m) {
        const mrg = 10;
        let x0 = textLine.group.position.x;
        let y0 = textLine.group.position.y;
        let br0 = textLine.texts[0].getBoundingClientRect();
        let height = br0.height;
        let x1 = x0 + textLine.texts[0].position.x - br0.width/2;
        let x2 = x0 + textLine.texts[m-1].position.x + 
            textLine.texts[m-1].getBoundingClientRect().width/2;
        let w = x2 - x1 + 2 * mrg;
        let x = (x1 + x2)/2;
        rect.position.set(x, y0-6);
        rect.width = w;
        rect.height = height + mrg;
    }
    selectSum(m) {
        if(m<3) return;
        this.highlightItems.forEach(r => r.visible = true);
        this.setHighlightingRect(this.highlightItems[0], this.textLines[0], m);
        this.setHighlightingRect(this.highlightItems[1], this.textLines[m-3+1],m*2-1);
        let textLine = this.textLines[0];
        this.highlightItems[2].position.set(
            textLine.group.position.x + textLine.texts[m+1].position.x,
            textLine.group.position.y);
    }
    async end() {
 
    }

    onKeyDown(event) {
        if('1'<=event.key && event.key <= '9') {
            this.selectSum(parseInt(event.key)+2);
        } else if(event.key === '0') {
            this.highlightItems.forEach(r => r.visible = false);
        }
    }
}

let t = new FibonacciSumSlide();

