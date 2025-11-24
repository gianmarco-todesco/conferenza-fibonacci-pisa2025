import {Slide, two, center} from '../../libs/gmtlib.js';   

class GcdIntroSlide extends Slide {
    constructor() {
        super("GcdIntro");
    }       
    initialize() {
    }

    createText(x,y,text, textStyle) {
        let txt = two.makeText(text,x,y,textStyle);
        this.mainGroup.add(txt);
        return txt;
    }
    createLine(x0,y0,x1,y1) {
        let line = two.makeLine(x0,y0,x1,y1);
        this.mainGroup.add(line);
        line.stroke = 'white';
        line.linewidth = 8;
        return line;
    }   

    createDiv(text, y, height) {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '100%';
        div.style.height = `${height}px`;
        div.style.top = `${y}px`;
        div.style.left = '0px';
        div.style.fontSize = '60px';
        div.style.fontWeight = 'bold';
        div.style.color = 'white';
        div.style.textAlign = 'center';
        div.innerHTML = text;
        document.body.appendChild(div);
        return div;
    }
    start() {

        let div;
        div = this.titleDiv = this.createDiv("Massimo comune divisore", 50, 100);
        div.style.fontSize = '60px';
        div.style.fontWeight = 'bold';

        div = this.formula1Div = this.createDiv("",250, 100);
        div = this.formula2Div = this.createDiv("",600, 100);

        katex.render(
            "\\frac{42}{56} = \\frac{3 \\cdot 14}{4 \\cdot 14} = \\frac{3}{4} "
            
            //`\\frac{\\cancel{37035}\\,{\\to}\\,3}{\\cancel{86415}\\,{\\to}\\,4}`
            , this.formula1Div, { throwOnError: false });


        this._status = 0;
        /*
        let mainGroup = this.mainGroup;

        this.createText(0, -400, "Massimo Comune Divisore", {
            size: '120px', fill:'white', weight: 'bold'
        })


        let numTxt = this.createText(0, 0, "123456", {
            size: '120px', fill:'orange', weight: 'bold'
        })
        let denTxt = this.createText(0, 120, "12345678", {
            size: '120px', fill:'orange', weight: 'bold'
        })
        let line = this.createLine(-250,50,250,50);    
        line.stroke = 'orange';

        let line1 = this.createLine(-200,-40,200,40);
        let line2 = this.createLine(-250,-40+120,250,40+120);
        */

    }
    cleanup() {
        this.titleDiv.remove();
        this.formula1Div.remove();
        this.formula2Div.remove();
    }   

    set status(s) {
        if(s<0) s= 0;
        else if(s>2) s = 2;
        this._status = s;
        switch(this._status)
        {
            case 0: this.formula2Div.innerHTML = ""; break;
            case 1: katex.render("\\frac{13555263220867}{14613728558971} = ?", this.formula2Div, { throwOnError: false }); break;
            case 2: katex.render("\\frac{13555263220867}{14613728558971} = " + 
                                "\\frac{3085553 \\cdot 4393139}{3326489 \\cdot 4393139} = " + 
                                "\\frac{3085553}{3326489} ", this.formula2Div, { throwOnError: false }); break;
        }
    }

    get status() { return this._status; }
    
    nextAct() { this.status++; }
    prevAct() { this.status--; }

    async end() {
    }
}

let t = new GcdIntroSlide();

