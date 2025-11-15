window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(TextPlugin);

    
});


function setup() {
    pixelDensity(2); 
    const cnv = createCanvas(800, 400);
    cnv.parent("example3"); 
}

const unit = 50;

function drawDomino(x,y,vertical) {
    fill(200, 0, 100);
    strokeWeight(4);
    let sc = 0.9;
    let w, h; if(vertical) { w=1; h=2; } else { w=2; h=1; } 
    let mrg = unit*0.05;
    rect(x*unit + mrg, y*unit + mrg, unit*w - 2*mrg, unit*h - 2*mrg, unit*0.2);
}

function draw() {
    background(255,255,255,255);
    push();
    translate(width/2, height/2);
    push();
    translate(-unit*8/2,-unit);
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(0,0,unit*8,unit*2);
    stroke(200);
    line(0,unit,unit*8,unit);
    for(let i=1;i<8;i++) line(i*unit,0,i*unit,unit*2);
    stroke(0);
    
    drawDomino(0,0,true);
    drawDomino(1,0,true);
    drawDomino(2,0,false);
    drawDomino(2,1,false);
    drawDomino(4,0,true);

    pop();
    pop();

}
