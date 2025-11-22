
"use strict";

let slides = [];
let slideIndex = -1;
let slide; 
let container;
let two;
let center; 

class Slide {
    constructor(name) {
        this.name = name;
        slides.push(this);
    }

    initialize() {
        console.log(`Initialize ${this.name}`);
    }

    start() {
        console.log(`Start ${this.name}`);
    }
    cleanup() {
        console.log(`Cleanup:  ${this.name}`);

    }
    async end() {
        console.log(`End:  ${this.name}`);

    }

    nextAct() {}
    prevAct() {}
    onKeyDown(event) {}
    onPointerDown(x,y,event) {}
    onPointerUp(event) {}
    onPointerDrag(x,y,dx,dy,event) {}
}


document.addEventListener("DOMContentLoaded", async function() {

    let firstSlideIndex = 0;
    let hpage = window.location.hash.slice(1);
    if(hpage != '') {
        let j = hpage|0;
        if(0<=j && j<slides.length) {
            firstSlideIndex = j;
        }
    }

    gsap.registerPlugin(TextPlugin) 
    gsap.registerPlugin(SplitText) 

    container = document.getElementById('container');
    const containerRect = container.getBoundingClientRect();
    
    two = window.two = new Two({
        width: containerRect.width,
        height: containerRect.height
    }).appendTo(container);
    center = window.center = {x:containerRect.width / 2, y: containerRect.height / 2};
    

    gsap.ticker.add(two.update.bind(two))

    slides.forEach(slide => slide.initialize());
    await setSlide(firstSlideIndex);
});

async function setSlide(index) {
    if(0 <= slideIndex && slideIndex < slides.length) {
        slide = slides[slideIndex];
        console.log("Ending slide ", slideIndex, slide.name);
        await slide.end();
        if(slide.ticker) gsap.ticker.remove(slide.ticker); 
        slide.ticker = null;
        slide.cleanup();
    }
    slideIndex = index;
    if(0 <= slideIndex && slideIndex < slides.length) {
        slide = slides[slideIndex];
        console.log("Starting slide ", slideIndex, slide.name);

        slide.start();
        if(slide.update) {
            const thisSlide = slide;
            function ticker(time, deltaTime) {
                // console.log("ticker:", thisSlide.name, time);
                if(thisSlide.ticker) thisSlide.update(time, deltaTime); 
            }
            slide.ticker = ticker;
            gsap.ticker.add(slide.ticker);
        }
    } else {
        slide = null;
    }   
    window.location.hash = `#${slideIndex}`;
    window.slide = slide;
}

function nextSlide() {
    if(0 <= slideIndex && slideIndex < slides.length - 1) {
        setSlide(slideIndex + 1);
    }
}

document.addEventListener("keydown", async function(event) {
    if(event.key === "ArrowDown") {
        console.log("Next slide");  
        if(slideIndex+1<slides.length) setSlide(slideIndex+1);
        event.preventDefault();
    } else if(event.key === "ArrowUp") {
        console.log("Prev slide");  
        if(slideIndex>0)setSlide(slideIndex-1);
        event.preventDefault();
    } else if(event.key === "ArrowRight") {
        if(slide) slide.nextAct();
        event.preventDefault();
    } else if(event.key === "ArrowLeft") {
        if(slide) slide.prevAct();
        event.preventDefault();
    } else {
        if(slide) slide.onKeyDown(event);   
        
    }
});


document.addEventListener('pointerdown', (e)=>{
    let x = e.clientX;
    let y = e.clientY;
    e.preventDefault();

    if(slide) slide.onPointerDown(x,y,e);
    function onPointerMove(e) {
        e.preventDefault();
        let dx = e.clientX - x;
        let dy = e.clientY - y;
        x = e.clientX;
        y = e.clientY;
        if(slide) slide.onPointerDrag(x,y,dx,dy,e);
    }
    function onPointerUp(e) {
        e.preventDefault();
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp); 
        if(slide) slide.onPointerUp(e);
    }
    
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
});



export {Slide, two, center, nextSlide};