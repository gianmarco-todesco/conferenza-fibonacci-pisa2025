import {Slide, two, center} from '../../libs/gmtlib.js';   

const margin = 90;

function setInBetween(t,t0,t1) {
    let x0 = t0.position.x + t0.getBoundingClientRect().width/2;
    let x1 = t1.position.x - t1.getBoundingClientRect().width/2;
    t.position.x = (x0+x1)/2;
} 

class SequenceSlide extends Slide {
    constructor() {
        super("Sequence");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup = two.makeGroup();
        mainGroup.position.set(center.x, center.y); 

        let title = this.title = two.makeText('Fibonacci Day : 23 ottobre',
            0, -30, {
                size: 40,
                family: 'Arial',
                fill: 'yellow',
                weight: 'bold'
        });
        mainGroup.add(title);

        const textStyle = this.textStyle = {
                    size: 50,   
                    family: 'Arial',
                    fill: 'white',
                    weight: 'bold'
            }
        let numbers = this.numbers = two.makeGroup();
        mainGroup.add(numbers);

        // build fibonacci sequence
        let fibs = [1,1];
        for(let i=0; i<20; i++) fibs.push(fibs[i]+fibs[i+1]);

        // create fibonacci texts and slash
        let fibsTexts = this.fibsTexts = fibs.map(i => two.makeText(i.toString(),0,0, textStyle));
        let slash = this.slash = two.makeText("/",0,0, textStyle);
        fibsTexts.forEach(t => {
            numbers.add(t);
            t.userData = {};
        });
        numbers.add(slash);

        two.update();

        let x;
        const margin = slash.getBoundingClientRect().width + 50;

        let w1 = 0;
        for(let i=0; i<4; i++) w1 += fibsTexts[i].getBoundingClientRect().width;
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
        numbers.position.set(0,50);
        

        this.plus = two.makeText("+", 0,0, textStyle);
        this.equal = two.makeText("=", 0,0, textStyle);
        numbers.add(this.plus);   
        numbers.add(this.equal);
        this.plus.visible = false;
        this.equal.visible = false;
                
        this.act = 0;
        
        this.leonardo = this.addImage('/slides/assets/Fibonacci2.jpg', 0, -700, 0.2);
        this.liberAbaci = this.addImage('/slides/assets/liber-abaci.jpg', -400, 0, 1.0);
    }

    addImage(path, x, y, scale) {
        let sprite = two.makeSprite(path, 0, 0);
        this.mainGroup.add(sprite);
        sprite.scale = scale;
        sprite.position.set(x, y);
        sprite.visible = false;
        return sprite;
    }

    cleanup() {
        this.mainGroup.remove();

    }
    async end() {
        
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
            case 4: this.secondAddition(1); break;
            case 5: case 6: case 7: this.secondAddition(this.act-3); break;
            case 8: this.showPicture1(); break;
            case 9: this.showPicture2(); break;
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
        this.title.position.set(0,-30);
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
        gsap.to(this.title.position, {y:-200, duration:1});
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
        gsap.to(plus, {duration:1, opacity:1});
        gsap.to(equal, {duration:1, opacity:1});
        gsap.to(txts, {fill:'blue'});
    }
    secondAddition(i) {
        const txts = [this.fibsTexts[i], this.fibsTexts[i+1], this.fibsTexts[i+2], this.fibsTexts[i+3]];
        const plus = this.plus, equal = this.equal;   
        if(i>0) {
            let t = txts[3];
            t.visible = true;
            t.opacity = 0;
            t.fill = 'blue';
        }
        let tl = gsap.timeline();
        tl.to(txts[0], {fill:'cyan', duration:0.25});
        tl.to([plus, equal], {duration:0.25, opacity:0, onComplete() {
            setInBetween(plus, txts[1], txts[2]);
            setInBetween(equal, txts[2], txts[3]);
        }},0);
        tl.to([plus, equal], {duration:0.25, opacity:1, stagger:0.1});
        tl.to(txts[3], {duration:0.25, fill:'blue', opacity:1});
    }
    

    showPicture1() {
        gsap.to(this.numbers.position, {x:-300, y:500})
        let img = this.leonardo;
        img.visible = true; img.opacity = 0;
        gsap.to(img, {duration:1, opacity:1});
        gsap.to(img.position, {duration:1, x:0, y:0});
    }
    showPicture2() {
        let img = this.liberAbaci;
        img.visible = true; img.opacity = 0;
        gsap.to(this.leonardo.position, {duration:1, x:-700});
        gsap.to(img, {duration:1, opacity:1});
        gsap.to(img.position, {duration:1, x:0, y:0});
    }

}

let t = new SequenceSlide();


