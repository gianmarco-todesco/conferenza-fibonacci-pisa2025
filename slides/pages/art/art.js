import {Slide, two, center} from '../../libs/gmtlib.js';   

class ArtSlide extends Slide {
    constructor() {
        super("Art");
    }   
    initialize() {
    }
    start() {
        let mainGroup = this.mainGroup = two.makeGroup();
        mainGroup.position.set(center.x, center.y);
        let sprite = two.makeSprite('/slides/assets/Mole_.jpg', 0, 0);
        mainGroup.add(sprite);
        sprite.scale = 0.25;
        sprite.position.set(-200, -100);

        sprite = two.makeSprite('/slides/assets/cubi-pisa.jpg', 0, 0);
        mainGroup.add(sprite);
        sprite.scale = 0.25;
        sprite.position.set(200, 100);
    }
    async end() {
    }
    cleanup() {
        this.mainGroup.remove();
    }
}

let t = new ArtSlide();

