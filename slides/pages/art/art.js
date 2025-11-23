import {Slide, two, center} from '../../libs/gmtlib.js';   

class SpriteProxy {
    constructor(sprite) {
        this.sprite = sprite;
        sprite.opacity = 0;
    }
    set opacity(v) {
        this.sprite.opacity = v;
    }   
    get opacity() {
        return this.sprite.opacity;
    }
}

class ArtSlide extends Slide {
    constructor() {
        super("Art");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup;
        let sprites = this.sprites = [];
        let sprite;
        let labels = this.labels = [];
        let label;


        sprite = two.makeSprite('/slides/assets/mole2.jpg', 0, 0);
        mainGroup.add(sprite);
        sprite.scale = 0.4;
        sprite.position.set(-300, 200);
        sprites.push(sprite);

        sprite = two.makeSprite('/slides/assets/mole1.jpg', 0, 0);
        mainGroup.add(sprite);
        sprite.scale = 0.7;
        sprite.position.set(-500, -100);
        sprites.push(sprite);
        

        sprite = two.makeSprite('/slides/assets/cubi-pisa.jpg', 0, 0);
        mainGroup.add(sprite);
        sprite.scale = 0.5;
        sprite.position.set(500, 0);
        sprites.push(sprite);
        
        sprite = two.makeSprite('/slides/assets/cubi-pisa-2.jpg', 0, 0);
        mainGroup.add(sprite);
        sprite.scale = 0.4;
        sprite.position.set(750, 200);
        sprites.push(sprite);
        
        let textStyle = {
            family: 'Arial',
            size: 40,
            leading: 24,
            weight: 'normal',
            fill: 'white'
        }
        label = two.makeText(
            "Mario Merz, \"Il volo dei numeri\". 2000", 
            -400, 480, textStyle);
        mainGroup.add(label);
        labels.push(label);

        label = two.makeText(
            "Gianni Lucchesi, \"OPERAE\". 2025", 
            500, 480, textStyle);
        mainGroup.add(label);
        labels.push(label);
        
        let sp = sprites.map(s => new SpriteProxy(s));
        gsap.to(sp, {opacity:1, duration:1, stagger:0.2});
        labels.forEach((l) => l.opacity=0);
        gsap.to(labels, {opacity:1, duration:1, stagger:0.3, delay: sp.length*0.2});
        /*
        let tl = gsap.timeline();
        sprites.forEach((s,i) => {
            s.opacity=0;
            tl.to(s, {opacity:1, duration:1}, i*0.3);
        });
        tl.to(labels, {opacity:1, duration:1, stagger:0.3});
        */
    }
    async end() {
        let lst = [...this.sprites, ...this.labels];
        return gsap.to(lst, {opacity:0, duration:1, stagger:0.2}).then();
    }
    cleanup() {
        this.mainGroup.remove();
    }
}

let t = new ArtSlide();

