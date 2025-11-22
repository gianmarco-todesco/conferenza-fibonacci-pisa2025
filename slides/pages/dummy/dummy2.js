import {Slide, two, center} from '../../libs/gmtlib.js';   

class Dummy2Slide extends Slide {
    constructor() {
        super("Dummy2");
    }       
    initialize() {
    }
    start() {
        let div = this.div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.width = '400px';
        div.style.height = '400px';
        div.style.top = '50px';
        div.style.left = '50px';
        div.style.fontSize = '80px';
        // div.style.backgroundColor = 'rgba(255,255,255,0.5)';
        document.body.appendChild(div);
        katex.render("\\alpha = 2\\pi \\frac{1}{3}", div, {
            throwOnError: false
        });

    }
    cleanup() {
        this.div.remove();
    }   

    async end() {
    }
}

let dummy2Slide = new Dummy2Slide();

