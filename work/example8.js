let circle;
const goldenAngle = (1 + Math.sqrt(5)) / 2;

window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(TextPlugin);

    var params = {
        fullscreen: false
    };
    var container = document.getElementById('example8');
    const containerRect = container.getBoundingClientRect();
    
    two = new Two({
        width: containerRect.width,
        height: containerRect.height
    }).appendTo(container);
    let center = {x:containerRect.width / 2, y: containerRect.height / 2};

    let pivot = two.makeGroup();
    let rect = two.makeRectangle(0,-10,10,20);
    pivot.translation.set(center.x, center.y);  
    pivot.add(rect);
    rect.stroke = 'black';

    let circles = [];
    for(let i=0;i<1000;i++) {
        circle = two.makeCircle(center.x,center.y,5);
        circle.fill = 'hsl(' + (i * 137.5 % 360) + ', 100%, 50%)';
        circle.stroke = 'none'; 
        circle.visible = false;
        circles.push(circle);
    }
    let factor = 2;

    setInterval(() => {
        let time = performance.now() * 0.001 * 10;
        pivot.rotation = time * (1/factor) * Math.PI*2 / goldenAngle + Math.PI/2;
        circles.forEach((circle, index) => {
            let t = time - index * factor;
            if(t<0) circle.visible = false;
            else {
                let phi = index * Math.PI*2 / goldenAngle;
                let r = 100.0*(t< 0.1 ? Math.sqrt(0.1**2 - (0.1-t)**2) : 1.0) + 100* t ** 0.5;
                r = 0.25*r;
                let x = center.x + r * Math.cos(phi);
                let y = center.y + r * Math.sin(phi);     
                circle.position.x = x;
                circle.position.y = y;
                circle.visible = true;
            }
        });
        two.update();
    },50);

    /*
    setInterval(() => {
        let angle = performance.now() * 0.001 * 0.01;
        circles.forEach((circle, index) => {
            let r = 30.0 + index**0.5 * 10;
            let phi = index * angle; // Math.PI*2 / goldenAngle;
            let x = center.x + r * Math.cos(phi);
            let y = center.y + r * Math.sin(phi);     
            circle.position.x = x;
            circle.position.y = y;
        });
        two.update();
    },50);
    */
});