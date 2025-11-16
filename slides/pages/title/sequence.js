import {Slide, two, center} from '../../libs/gmtlib.js';   

const margin = 90;

class SequenceSlide extends Slide {
    constructor() {
        super("Sequence");
    }   
    initialize() {
    }
    start() {
        
        let title = this.title = two.makeText('Fibonacci Day : 23 ottobre',
            center.x, center.y - 30, {
                size: 40,
                family: 'Arial',
                fill: 'yellow',
                weight: 'bold'
        });

        const textStyle = this.textStyle = {
                    size: 50,   
                    family: 'Arial',
                    fill: 'white',
                    weight: 'bold'
            }
        let group = this.group = two.makeGroup();
        let cc = ["1","1","/","2","3"];
        for(let i=0; i<cc.length; i++) {
            let c = cc[i];
            let char = two.makeText(c,- 60 + i*30, 0, textStyle);
            group.add(char);
        }
        this.slash = group.children[2];
        this.numbers = [0,1,3,4].map(i => group.children[i]);
        group.position.y = center.y + 50;
        group.position.x = center.x;
        window.group = group;

        this.plus = two.makeText("+", 0,0, textStyle);
        this.equal = two.makeText("=", 0,0, textStyle);
        group.add(this.plus);   
        group.add(this.equal);
        this.plus.visible = false;
        this.equal.visible = false;
        
        
        this.act = 0;
        two.update();
        this.fib = [1,1,2,3];
    }
    cleanup() {
        this.numbers.forEach(num => num.remove());
        this.plus.remove();
        this.equal.remove();
        this.title.remove();
        this.group.remove();
        this.numbers = null;
        this.plus = null;
        this.equal = null;
        this.title = null;
        this.group = null;
    }
    async end() {
        /*

        let tl = gsap.timeline();
        this.div.style.opacity = 1;
        tl.to(this.text, {duration :1, opacity: 0}, 0);
        tl.to(this.div.style, {duration :1, opacity: 0}, 0);
        
        let promise = new Promise((resolve) => {
            tl.eventCallback("onComplete", resolve);
        });
        await promise;
        */
    }

    nextAct() {
        this.act++;
        switch(this.act) {
            case 1: this.act1(); break;
            case 2: this.act2(); break;
            default: this.act3(); break;
        }
    }
    act1() {
        gsap.to(this.title.position, {y:-50, duration:1});
        gsap.to(this.slash, {opacity:0, duration:1});
        for(let i=0; i<this.numbers.length; i++) {
            let num = this.numbers[i];
            let dist = margin;
            gsap.to(num.position, {
                x: (i-1.5) * dist, duration:1});
        }
    }
    act2() {
        this.plus.visible = true;this.plus.opacity = 0;
        this.equal.visible = true;this.equal.opacity = 0;
        gsap.to(this.plus, {duration:1, opacity:1});
        gsap.to(this.equal, {duration:1, opacity:1});
        this.plus.position.x = -margin;
        this.equal.position.x = 0;
        this.numbers[3].opacity = 0.5
    }
    act3() {
        let i = this.act - 3;
        let newPlusPos = i * margin;
        let newEqualPos = (i+1) * margin;
        const plus = this.plus;
        const equal = this.equal;
        let tl = gsap.timeline();
        tl.to(this.numbers[i], {duration:1, fill:'blue'},0);
        tl.to([this.plus, this.equal], {duration:0.5, opacity:0, onComplete() {
            plus.position.x = newPlusPos;
            equal.position.x = newEqualPos;
        }},0);
        if(3+i>=this.numbers.length) {
            let i = this.fib.length;
            let v = this.fib[i-1] + this.fib[i-2];
            this.fib.push(v);
            let x = this.numbers[this.numbers.length -1].position.x
                 + margin;
            let num = two.makeText(v.toString(),
                x, 0, this.textStyle);
            this.group.add(num);
            this.numbers.push(num);
            num.opacity = 0;
        }
        tl.to([this.plus, this.equal, this.numbers[3+i]], {duration:1, opacity:1}, 0.5);
        if(this.numbers[this.numbers.length -1].position.x + this.group.position.x > 400) {
            let delta = this.numbers[this.numbers.length -1].position.x + this.group.position.x - 400;
            tl.to(this.group.position, {duration:2, x: this.group.position.x - delta}, 0);
        }
    }

}

let t = new SequenceSlide();


