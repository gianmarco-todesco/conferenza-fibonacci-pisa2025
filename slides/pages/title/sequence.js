import {Slide, two, center} from '../../libs/gmtlib.js';   

const margin = 90;

function setInBetween(t,t0,t1) {
    let x0 = t0.position.x + t0.getBoundingClientRect().width/2;
    let x1 = t1.position.x - t1.getBoundingClientRect().width/2;
    t.position.x = (x0+x1)/2;
} 

function computeXBetween(t0,t1) {
    let x0 = t0.position.x + t0.getBoundingClientRect().width/2;
    let x1 = t1.position.x - t1.getBoundingClientRect().width/2;
    return (x0+x1)/2;
}

class SequenceSlide extends Slide {
    constructor() {
        super("Sequence");
    }   
    initialize() {
    }
    start() {

        let mainGroup = this.mainGroup;


        // build fibonacci sequence
        let fibs = [1,1];
        for(let i=0; i<30; i++) 
            fibs.push(fibs[i]+fibs[i+1]);

        const textStyle = this.textStyle = {
            size: 150,   
            family: 'Arial',
            fill: 'white',
            weight: 'bold'
        }


        // create group for numbers
        let numbers = this.numbers = two.makeGroup();
        numbers.position.set(0,50);
        mainGroup.add(numbers);

        // create fibonacci texts and slash
        let fibsTexts = this.fibsTexts = fibs.map(i => two.makeText(i.toString(),0,0, textStyle));
        let slash = this.slash = two.makeText("/",0,0, textStyle);
        slash.visible = false;
        fibsTexts.forEach(t => {
            numbers.add(t);
            t.visible = false;
            t.userData = {};
        });
        numbers.add(slash);



        two.update();

        let title = this.title = two.makeText('Fibonacci Day : 23 ottobre',
            0, 0, {
                size: 120,
                family: 'Calibri',
                fill: 'rgba(91, 221, 241, 1)',
                weight: 'bold'
        });
        mainGroup.add(title);


        let x;
        const margin = slash.getBoundingClientRect().width + 100;

        let w1 = 0;
        for(let i=0; i<4; i++) 
            w1 += fibsTexts[i].getBoundingClientRect().width;
        let w2 = w1 + slash.getBoundingClientRect().width;

        // set initial positions
        x = -w2/2;
        for(let i=0; i<4; i++) {
            let t = fibsTexts[i];
            let w = t.getBoundingClientRect().width;
            t.position.x = x + w/2;
            t.userData.x0 = t.position.x;
            x += w;
            if(i==1) {
                slash.position.x = x + slash.getBoundingClientRect().width/2;
                x += slash.getBoundingClientRect().width;  
            }
        }

        // compute final positions
        x = -(w1 + margin*3)/2;
        for(let i=0; i<fibsTexts.length; i++) {
            let t = fibsTexts[i];
            let br = t.getBoundingClientRect(); 
            t.userData.x = x + br.width/2;
            x += br.width + margin;
            t.visible = i < 4;
            if(i>=4) t.position.x = t.userData.x;
        }
        

        this.plus = two.makeText("+", 0,0, textStyle);
        this.equal = two.makeText("=", 0,0, textStyle);
        numbers.add(this.plus);   
        numbers.add(this.equal);
        this.plus.visible = false;
        this.equal.visible = false;
                
        this.act = 0;
        this.reset();

        this.leonardo = this.addImage(
            '/slides/assets/Fibonacci2.jpg', 0, -700, 0.4,
            'Leonardo Pisano detto il Fibonacci o Bigollo. ca. 1170 – 1250', 450);
        this.liberAbaci = this.addImage('/slides/assets/liber-abaci.jpg', -400, 0, 0.75);
    }

    addImage(path, x, y, scale, caption, captionYOffset=30) {
        let imgGroup = two.makeGroup();
        imgGroup.visible = false;
        this.mainGroup.add(imgGroup);        
        let sprite = two.makeSprite(path, 0, 0);
        imgGroup.add(sprite);
        sprite.scale = scale;
        if(caption) {
            let text = two.makeText(caption, 0, captionYOffset, {
                size: 30,
                family: 'Arial',
                fill: 'white',
            });
            imgGroup.add(text);
        }
        imgGroup.position.set(x,y);
        return imgGroup;
    }

    cleanup() {
        

    }
    async end() {
        let tl = gsap.timeline();
        tl.to(this.numbers.position, {duration: 0.5, y : 2000},0);
        tl.to(this.leonardo.position, {duration: 0.5, x : -2000},0);
        tl.to(this.liberAbaci.position, {duration: 0.5, x : 2000},0);
        return tl;
    }

    onKeyDown(event) {
        if(event.key === '0') this.setAct(0);
    }
    
    setAct(act) {
        this.act = act;
        switch(this.act) {
            case 0: this.reset(); break;
            case 1: this.fourNumbers(); break;
            case 2: this.firstAddition(); break;
            case 3: this.secondAddition(0); break;
            case 4: this.secondAddition(1, 1000); break;
            case 5: this.showPicture1(); break;
            case 6: this.showPicture2(); break;
        }
    }
    nextAct() {
        this.setAct(this.act + 1);
    }
    prevAct() {
        if(this.act>0) this.setAct(this.act - 1);
    }
    
    reset() {
        // reset everything
        this.title.position.set(0,-180);
        this.title.opacity = 1;
        this.fibsTexts.forEach( (t,i) => {
            if(i<4) { t.position.x = t.userData.x0; t.opacity = 1; }
            else { t.opacity = 0; t.visible = false; }
            t.fill = 'white';
        });
        this.slash.visible = true;
        this.slash.opacity = 1;
        this.plus.visible = false;
        this.equal.visible = false;
        this.numbers.position.set(0,50);
    }
    fourNumbers() {
        // remove title and slash between 11 and 23
        gsap.to(this.title.position, {y:-800, duration:1});
        gsap.to(this.title, {opacity:0, duration:1});
        gsap.to(this.slash, {opacity:0, duration:1});
        // move numbers in their positions
        for(let i=0; i<4; i++) {
            let txt = this.fibsTexts[i];
            let x = txt.userData.x;
            gsap.to(txt.position, { x: x, duration:1});
        }
    }

    firstAddition() {
        // insert plus and equal
        const txts = [this.fibsTexts[0], this.fibsTexts[1], this.fibsTexts[2]];
        const plus = this.plus, equal = this.equal;   
        setInBetween(plus, txts[0], txts[1]);
        setInBetween(equal, txts[1], txts[2]);
        plus.fill = equal.fill = 'blue';
        plus.opacity = equal.opacity = 0;
        plus.visible = equal.visible = true;
        gsap.to(plus, {duration:0.5, opacity:1});
        gsap.to(equal, {duration:0.5, opacity:1});
        gsap.to(txts, {fill:'blue'});
    }
    secondAddition(i0, m = 1) {
        let tl = gsap.timeline();
        const txts = this.fibsTexts;
        const plus = this.plus, equal = this.equal;
        let lastIndex = i0;
        for(let i=i0; i<i0+m && i+3<txts.length; i++) {
            lastIndex = i+3;
            if(i>0) {
                let t = txts[i+3];
                t.visible = true;
                t.opacity = 0;
                t.fill = 'blue';
            }
            const x0 = computeXBetween(txts[i+1], txts[i+2]);
            const x1 = computeXBetween(txts[i+2], txts[i+3]);
            let t = "ta"+i;
            tl.to(txts[i], {fill:'cyan', duration:1}, t);
            tl.to([plus, equal], {opacity:0, duration:0.25, 
                onComplete() {
                    plus.position.x = x0;
                    equal.position.x = x1;
                }},t);
            tl.to([plus, equal], {duration:0.5, opacity:1, stagger:0.125});
            tl.to(txts[i+3], {duration:0.25, fill:'blue', opacity:1}, t + "+0.01");

            let w = txts[i+3].userData.x + txts[i+3].getBoundingClientRect().width;
            let sc = this.numbers.scale;
            if(this.numbers.position.x + w * sc > two.width / 2) {
                let newX = two.width/2 - w * sc;
                tl.to(this.numbers.position, {duration:0.5, x: newX}, t); 
            }

        }


    }
    

    showPicture1() {
        gsap.to(this.numbers.position, {y:480})
        let img = this.leonardo;
        img.visible = true; img.opacity = 1;
        // gsap.to(img, {duration:1, opacity:1});
        gsap.to(img.position, {duration:1, x:0, y:-100});
    }
    showPicture2() {
        let img = this.liberAbaci;
        img.position.set(1000,-100);
        img.visible = true; img.opacity = 1;
        gsap.to(this.leonardo.position, {duration:1, x:-500});
        // gsap.to(this.numbers.position, {y:600})
        // gsap.to(img, {duration:1, opacity:1});
        gsap.to(img.position, {duration:1, x:300});
    }

}

let t = new SequenceSlide();


