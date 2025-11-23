import {Slide, two, center} from '../../libs/gmtlib.js';   


function createDiv( left, top,width, height, parent=document.body) {
    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = width;
    div.style.height = height;
    div.style.top = top;
    div.style.left = left;
    parent.appendChild(div);
    return div;
} 


class GoldenRatioSlide extends Slide {
    constructor() {
        super("GoldenRatio");
    }       
    initialize() {
    }
    start() {
        let mainDiv = this.mainDiv = createDiv('0px', '0px', '100%', '100%');
        mainDiv.style.fontSize = '40px';
        mainDiv.style.color = 'white';
        mainDiv.style.verticalAlign = 'middle';
        mainDiv.style.textAlign = 'center';

        let fibs = [1,1];
        for(let i=0; i<30; i++) 
            fibs.push(fibs[i]+fibs[i+1]);


        let div1 = createDiv('20px', '20px', '100px', '50px', mainDiv);
        let div2 = createDiv('120px', '20px', '250px', '50px', mainDiv);
        let div3 = createDiv('390px', '20px', '600px', '50px', mainDiv);

        let i = 12;
        const ck = "1.618033988749895";

        console.log(`\\frac{F_{${i+1}}}{F_{${i}}}`);
        katex.render(`\\frac{F_{${i+1}}}{F_{${i}}}`, div1, { throwOnError: false });
        katex.render(`= \\frac{${fibs[i+1]}}{${fibs[i]}}`, div2, {throwOnError: false });
        
        i = 0;
        let a=1, b=1;
        const me = this;
        let timerId = this.timerId = setInterval(()=>{
            if(!me.timerId) return;
            [a,b] = [b,a+b];
            katex.render(`\\frac{F_{${i+1}}}{F_{${i}}}`, div1, { throwOnError: false });
            katex.render(`= \\frac{${a}}{${b}}`, div2, {throwOnError: false });
            let v = (b/a).toFixed(15);  
            if(v == ck) {
                clearInterval(timerId);
                me.timerId = null;
            } else {
                let j = 0;
                while(j+1< v.length && v.substring(0,j+1) == ck.substring(0,j+1)) j++;
                v = v.substring(0,j) + "<span style='color:red'>" + v.substring(j) + "</span>";
            }
            div3.innerHTML = "= " + v;
            i+=1;

        }, 1000)

        let y = 200; let h = 120;
        let div4 = createDiv('20px', `${y}px`, '960px', `${h}px`, mainDiv);
        katex.render(
            "\\varphi = \\frac{1+\\sqrt{5}}{2} = 1.618033988749895...", 
                div4, { throwOnError: false });
        y+=h;
        let div5 = createDiv('20px', `${y}px`, '960px', `${h}px`, mainDiv);
        katex.render(
            "1+\\varphi = \\varphi^2 \\ ", 
                div5, { throwOnError: false });

        y+=h;
        let div6 = createDiv('20px', `${y}px`, '960px', `${h}px`, mainDiv);
        katex.render(
            "\\frac{F_{n+1}}{F_{n}} \\xrightarrow[n \\to \\infty]{} \\varphi", 
                div6, { throwOnError: false });

                /*
        for(let i=0; i< fibs.length - 1; i++) {
            let div2 = document.createElement('div');
            div.appendChild(div2); 
            div2.style.margin = '20px';
            // let txt = two.makeText( `${fibs[i+1]}/${fibs[i]} = ${ratio}`, 0, i*30 - 300, {
        // div.style.backgroundColor = 'rgba(255,255,255,0.5)';
            
            katex.render(`\\frac{F_${i+1}}{F_${i}} = \\frac{${fibs[i+1]}}{${fibs[i]}} = ${v}`, div2, {
                throwOnError: false
            });
        }
            */
    }
    cleanup() {
        if(this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.mainDiv.remove();
    }
    

    async end() {
    }
}

let goldenRatioSlide = new GoldenRatioSlide();

