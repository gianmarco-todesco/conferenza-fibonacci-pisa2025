
"use strict";

let slides = [];
let slideIndex = 0;
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
}


document.addEventListener("DOMContentLoaded", function() {

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
    if(slides.length > 0) {
        slides[0].start();
        slide = slides[0];
    } else {
        slide = null;
    }
    window.slide = slide;
});

async function setSlide(index) {
    if(0 <= slideIndex && slideIndex < slides.length) {
        slide = slides[slideIndex];
        await slide.end();
        slide.cleanup();
    }
    slideIndex = index;
    if(0 <= slideIndex && slideIndex < slides.length) {
        slide = slides[slideIndex];
        slide.start();
    } else {
        slide = null;
    }   
    window.slide = slide;
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

export {Slide, two, center};