const phi = (1 + Math.sqrt(5)) / 2;


let draw, group;
// Variabili per il drag
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

class Square {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
    }
}

class Dot {
    constructor(draw, pos, radius) {
        this.radius = radius;
        this.element = draw.circle(radius*2, radius*2);
        this.pos = pos;
    }
    updateGeometry(center, scaleFactor) {
        let x = center.x + scaleFactor * this.pos.x - this.radius;
        let y = center.y + scaleFactor * this.pos.y - this.radius;
        this.element.move(x, y);    
    }
}

class Line {
    constructor(draw, p0, p1) {
        this._draw = draw;
        this.element = draw.line();
        this.p0 = p0;
        this.p1 = p1;
    }
    updateGeometry(center, scaleFactor) {
        let x0 = center.x + scaleFactor * this.p0.x;
        let y0 = center.y + scaleFactor * this.p0.y;
        let x1 = center.x + scaleFactor * this.p1.x;
        let y1 = center.y + scaleFactor * this.p1.y;

        // Clip segment (x0,y0)-(x1,y1) to viewport [0,0,width,height] using Liang-Barsky
        (function() {
            const xmin = 0, ymin = 0;
            const xmax = this._draw.width(), ymax = this._draw.height();
            let dx = x1 - x0, dy = y1 - y0;
            let t0 = 0.0, t1 = 1.0;
            const EPS = 1e-12;

            function clip(p, q) {
            if (Math.abs(p) < EPS) {
                // Line parallel to this edge
                return q >= 0;
            }
            const r = q / p;
            if (p < 0) {
                if (r > t1) return false;
                if (r > t0) t0 = r;
            } else {
                if (r < t0) return false;
                if (r < t1) t1 = r;
            }
            return true;
            }

            // Left edge: x >= xmin  ->  -dx * t <= x0 - xmin  => p = -dx, q = x0 - xmin
            if (!clip(-dx, x0 - xmin) ||
            // Right edge: x <= xmax ->  dx * t <= xmax - x0    => p = dx, q = xmax - x0
            !clip(dx, xmax - x0) ||
            // Top edge: y >= ymin
            !clip(-dy, y0 - ymin) ||
            // Bottom edge: y <= ymax
            !clip(dy, ymax - y0)) {
            this.element.hide();
            return;
            }

            // If segment is outside after clipping
            if (t0 > t1) {
            this.element.hide();
            return;
            }

            const nx0 = x0 + dx * t0;
            const ny0 = y0 + dy * t0;
            const nx1 = x0 + dx * t1;
            const ny1 = y0 + dy * t1;

            x0 = nx0; y0 = ny0; x1 = nx1; y1 = ny1;
            this.element.show();
        }).call(this);
        this.element.plot(x0, y0, x1, y1);

    }
}   

function getDist(p0,p1) { return Math.sqrt((p1.x - p0.x)*(p1.x - p0.x) + (p1.y - p0.y)*(p1.y - p0.y)); }


class FibonacciSpiral {
    constructor() {
        this._elements = [];
        this._makeSquares(18); // max number without precision issues
        this._computeSpiralCenter();
        this._computeVertices();
        this._scaleFactor = 10.0;
        this._center = new SVG.Point(400,200);
    }

    world2win(pt) { return new SVG.Point(this._center.x + this._scaleFactor * pt.x, this._center.y + this._scaleFactor * pt.y); }    
    win2world(pt) { return new SVG.Point(pt.x / this._scaleFactor - this._center.x, pt.y / this._scaleFactor - this._center.y); }
    
    _makeSquares(N) {
        let squares = this.squares = [];
        let x = 0, y = 0;
        let a = 1, b = 0; 
        for(let i=0; i<N; i++) {
            squares.push(new Square(x,y,a));
            x += a;        
            [a,b] = [a+b, a];
            squares.push(new Square(x,y,a));
            x -= b;
            y += a;
            [a,b] = [a+b, a];
            squares.push(new Square(x,y,a));
            y -= b;
            [a,b] = [a+b, a];
            x -= a;
            squares.push(new Square(x,y,a));
            [a,b] = [a+b, a];
            y -= a;          
        }
    }
    _computeSpiralCenter() {
        // i <= (n-2)/4;  n = 10 => 2->8,9 OK; n = 14 => 
        
        let i = Math.floor((this.squares.length-2)/4) * 4;
        
        let sq = this.squares[i];
        let sq1 = this.squares[i+1];
        let y0 = sq.y;
        let y1 = sq1.y + sq1.size;

        let x0 = sq.x;
        let x1 = sq.x + sq.size;
        let x2 = sq1.x + sq1.size;
        this.lines = {x0,x1,x2,y0,y1};
        //let line1 = this.draw.line(x2, y0, x0, y1).stroke({color:'#f00', width:2});        
        //let line2 = this.draw.line(x0, y0, x1, y1).stroke({color:'#0f0', width:2});        
        let dx1 = (x2-x0)/(y1-y0), dx2 = (x1-x0)/(y1-y0);
        let y = y0 + (x2-x0)/(dx1+dx2);
        let x = x0 + dx2 * (y - y0);
        this.spiralCenter = {x,y};
    }

    _computeVertices() {
        let vertices = this._vertices = [];
        for(let i=0; i<this.squares.length; i++) {
            let pt = this.getPoint(i);
            let ux = pt.x - this.spiralCenter.x;
            let uy = pt.y - this.spiralCenter.y;
            let r = Math.sqrt(ux*ux + uy*uy);
            let phi = Math.atan2(uy,ux);
            if(vertices.length > 0) {
                let prevPhi = vertices[vertices.length-1].phi;
                while(phi < prevPhi) phi += 2*Math.PI;
            }
            vertices.push({pt, r, phi});
        }
        let pts = this._spiralPts = [];        
        for(let i=1; i<vertices.length; i++) {
            let v0 = vertices[i-1];
            let v1 = vertices[i];
            let done = false;
            let m = 10;
            const eps = 1.0e-4;
            for(let j=1; j<=m; j++) {
                let t = j/m;
                let tt = [t,t-eps,t+eps];
                let pp = [];
                for(let k=0;k<3;k++) {
                    let tk = tt[k];
                    let phi = v0.phi * (1-tk) + v1.phi * tk;
                    let cs = Math.cos(phi), sn = Math.sin(phi);
                    let r = Math.exp(Math.log(v0.r) * (1-tk) + Math.log(v1.r) * tk);
                    let x = this.spiralCenter.x + r * cs;
                    let y = this.spiralCenter.y + r * sn;
                    pp.push({x,y,phi,r});
                }
                let x = pp[0].x, y = pp[0].y;
                let vx = pp[2].x - pp[1].x;
                let vy = pp[2].y - pp[1].y;
                let norm = Math.sqrt(vx*vx + vy*vy);
                vx /= norm; vy /= norm;
                pts.push({x, y, vx, vy, r:pp[0].r, phi:pp[0].phi});
            }
        }

        for(let i=0; i+1<pts.length; i++) pts[i].dist = getDist(pts[i], pts[i+1]);
        pts[pts.length-1].dist = getDist(pts[pts.length-2], pts[pts.length-1]);
    }

    _createSquareSVGElements(draw, square) {
            
                /*
            const label = draw.text(sq.size.toString())
                .font({
                    size: 20,
                    anchor: 'middle',  // centra il testo rispetto al suo punto x
                    weight: 'bold',
                    leading: 1,
                    fill: '#fff'
                })
            let sx,sy,ex,ey,sweep;
            let corner = index%4;
            switch (corner) {
                case 2: sx = size; sy = 0;     ex = 0;    ey = size; break;
                case 1: sx = 0;    sy = 0;     ex = size; ey = size; break;
                case 0: sx = 0;    sy = size;  ex = size; ey = 0;     break;
                case 3: sx = size; sy = size;  ex = 0;    ey = 0;     break;
            }
            sweep = 1;

            const arc = `M ${sx} ${sy} A ${size} ${size} 0 0 ${sweep} ${ex} ${ey}`;
            const spiralSegment = draw.path(arc).fill('none')
                .stroke({ color: '#fff', width: 2 });

                
            label.center(rect.cx(), rect.cy());
            let box = group.group();
            box.add(rect);
            box.add(label);
            box.add(spiralSegment);
            box.move(sq.x * this._scaleFactor + this._center.x, 
                      sq.y * this._scaleFactor + this._center.y)                

            sq.svgElement = box;
            sq.rectElement = rect;
            sq.labelElement = label;
            sq.spiralSegment = spiralSegment;
            
            box.hide();
            */
    }

    _updateSquareSVGElements(square) {
        let size = this._scaleFactor * square.size;
        const threshold = 10;
        
        if(size < threshold) {
            square.rect.hide();
            square.label.hide();
        } else {
            const rect = square.rect;
            const label = square.label;
            rect.show();
            let pos = this.world2win({x: square.x, y: square.y});
            rect.size(size,size).move(pos.x, pos.y);
            
            if(size >= threshold * 2) {
                label.show();
                label.center(rect.cx(), rect.cy());
            } else {
                label.hide();
            }
        }
    }
    _updateSVGElements() {
        this.squares.forEach((square,i) => {
            if(i<this._squareCount)
                this._updateSquareSVGElements(square)
                
                
        });
        this._elements.forEach(el => {el.updateGeometry(this._center, this._scaleFactor);})
        this._updateSpiralSVGElement();
    }

    createSVGElements(draw) {
        this._center = new SVG.Point(draw.width()/2,draw.height()/2);
        this._draw = draw;
        this.squares.forEach(square=>{
            square.rect = draw.rect()
                .radius(2)
                .stroke('#fff')
                .fill('none');
            square.label = draw.text(square.size.toString())
                .font({
                    size: 20,
                    anchor: 'middle',  // centra il testo rispetto al suo punto x
                    weight: 'bold',
                    leading: 1,
                    fill: '#fff'
                })
            
        });

        let ld = this.lines; 

        /*
        let line1 = new Line(this._draw, {x:ld.x2, y:ld.y0}, {x:ld.x0, y:ld.y1});
        line1.element.stroke({color:'#f00', width:2});
        let line2 =    new Line(this._draw, {x:ld.x0, y:ld.y0}, {x:ld.x1, y:ld.y1});    
        line2.element.stroke({color:'#0f0', width:2});        
        this._elements.push(line1, line2)
        */

        let dot = new Dot(this._draw, this.spiralCenter, 3);
        this._elements.push(dot);
        
        this._makeSpiral();
        this._updateSVGElements();
        /*
        this.spiralCenterDot = draw.circle(5,5).fill('green');
        
        square.spiral = [];
        let m = 50;
        for(let i=0; i<m; i++) {
            let dot = draw.circle(3).fill('#ff0');
            square.spiral.push(dot);
        }
        this._squareCount = 0;
        */
    }

    getPoint(i) {
        let x, y;
        if(i>=this.squares.length) return {x:0,y:0};
        let sq = this.squares[i];
        switch(i%4) {
            case 0: x = sq.x + sq.size; y = sq.y; break;
            case 1: x = sq.x + sq.size; y = sq.y + sq.size; break;  
            case 2: x = sq.x; y = sq.y + sq.size; break;
            default: x = sq.x; y = sq.y; break;
        }
        return {x,y};
    }

    _makeSpiral() {

        this._spiralElement = this._draw.path().fill('red').opacity(0.5).stroke({color:'#ff0', width:0.5});
    }

    _updateSpiralSVGElement() {

        let vertices = this._vertices;
        let pts = this._spiralPts;
        let i = 0;
        while(i<pts.length && pts[i].r * this._scaleFactor < 15.0) i++;
        let i0 = i;
        while(i<pts.length && pts[i].r * this._scaleFactor < 0.3* this._draw.height()) i++;
        let i1 = i-1;
        
        if(i0>i1) {
            this._spiralElement.plot("");
        } else {

            let lst = [];
            for(let i=i0; i<=i1; i++) {
                let x,y;
                x = this._center.x + pts[i].x * this._scaleFactor;
                y = this._center.y + pts[i].y * this._scaleFactor;
                let vx = pts[i].vx, vy = pts[i].vy;
                let ux = -vy, uy = vx;
                let du = this._scaleFactor * pts[i].r * 0.05;
                let dv = pts[i].dist * this._scaleFactor / 3;
                lst.push({x,y,dux:du*ux, duy:du*uy, dvx:dv*vx, dvy:dv*vy});
            }

            const commands = [['M', lst[0].x, lst[0].y]];
            for(let i=1; i<lst.length; i++) {                
                commands.push(['C', 
                    lst[i-1].x + lst[i-1].dux + lst[i-1].dvx,
                    lst[i-1].y + lst[i-1].duy + lst[i-1].dvy,
                    lst[i].x + lst[i].dux - lst[i].dvx,
                    lst[i].y + lst[i].duy - lst[i].dvy,
                    lst[i].x + lst[i].dux,
                    lst[i].y + lst[i].duy]);
            }
            for(let i=lst.length-2; i>=1; i--) {                
                commands.push(['C', 
                    lst[i+1].x - lst[i+1].dux - lst[i+1].dvx,
                    lst[i+1].y - lst[i+1].duy - lst[i+1].dvy,
                    lst[i].x - lst[i].dux + lst[i].dvx,
                    lst[i].y - lst[i].duy + lst[i].dvy,
                    lst[i].x - lst[i].dux,
                    lst[i].y - lst[i].duy]);
            }
        
            this._spiralElement.plot(commands);
        }
    }    
    
    set scaleFactor(s) {
        this._scaleFactor = s;
        this._updateSVGElements();
        
    }

    get scaleFactor() {
        return this._scaleFactor;
    }

    set squareCount(n) {
        let old = this._squareCount;
        this._squareCount = n;
        this.squares.forEach((square, index) =>{
            if(index < n) {
                square.rect.show();
                square.label.show();
                this._updateSquareSVGElements(square);
            } else {
                square.rect.hide();
                square.label.hide();
            }
        });
        if(n == old+1) {
            let sq = this.squares[n-1];
            let node = sq.rect.node;
            gsap.set(node, {scale:0.1, transformOrigin: "50% 50%"});
            gsap.to(node, {scale:1.0, transformOrigin: "50% 50%", duration: 0.5});
            node = sq.label.node;
            gsap.set(node, {opacity:0});
            gsap.to(node, {opacity:1, duration: 1.0});
            let p = model.world2win(model.getPoint(n));
            let dist = getDist(p, {x:model._draw.width()/2, y:model._draw.height()/2});
            if(dist > 300) {
                console.log("quick zooming to ", dist);
                let targetScale = model.scaleFactor * 300 / dist;
                gsap.to(model, {scaleFactor: targetScale, duration: 1.0});
            }
        } else if(n == old-1) {
            /*
            let node = this.squares[n].rect.node;
            let svgElement = this.squares[n].svgElement;
            svgElement.show();
            // gsap.set(node, {scale:0.1, transformOrigin: "50% 50%"});
            gsap.to(node, {
                scale:0.1, transformOrigin: "50% 50%", duration: 0.5,
                onComplete: () => {svgElement.hide()} 
            });
            */

        }
        
    }
    get squareCount() {
        return this._squareCount;
    }


    foobar() {
        
        let i = 4*5; // (Math.floor(this.squares.length/4)-1);
        let sq = this.squares[i];
        let sq1 = this.squares[i+1];
        let y0 = this._center.y + this._scaleFactor*sq.y;
        let y1 = this._center.y + this._scaleFactor*(sq1.y + sq1.size);

        let x0 = this._center.x + this._scaleFactor*sq.x;
        let x1 = this._center.x + this._scaleFactor*(sq.x + sq.size);
        let x2 = this._center.x + this._scaleFactor*(sq1.x + sq1.size);
        let line1 = this.draw.line(x2, y0, x0, y1).stroke({color:'#f00', width:2});        
        let line2 = this.draw.line(x0, y0, x1, y1).stroke({color:'#0f0', width:2});        
        let dx1 = (x2-x0)/(y1-y0), dx2 = (x1-x0)/(y1-y0);
        let y = y0 + (x2-x0)/(dx1+dx2);
        let x = x0 + dx2 * (y - y0);
        let spiralCenter = {x,y}
       


        this.draw.circle(5,5)
            .move(spiralCenter.x-2.5,spiralCenter.y-2.5)
            .stroke({color:'#00f', width:2});
        
        let squares = this.squares;
        let center = this._center;
        let scaleFactor = this._scaleFactor;

        function getPt(i) {
            let x, y;
            let sq = squares[i];
            switch(i%4) {
                case 0: x = sq.x + sq.size; y = sq.y; break;
                case 1: x = sq.x + sq.size; y = sq.y + sq.size; break;
                case 2: x = sq.x; y = sq.y + sq.size; break;
                default: x = sq.x; y = sq.y; break;
            }
            return {x: center.x + scaleFactor*x, y: center.y + scaleFactor*y}
        }

        let p = getPt(0);
        let ux = p.x - spiralCenter.x, uy = p.y - spiralCenter.y;
        let r0 = Math.sqrt(ux*ux + uy*uy);
        let phi0 = Math.atan2(uy,ux);
        for(let i=1; i<20; i++) {
            p = getPt(i);
            ux = p.x - spiralCenter.x;
            uy = p.y - spiralCenter.y;
            let r1 = Math.sqrt(ux*ux + uy*uy);
            let phi1 = Math.atan2(uy,ux);
            while(phi1 < phi0) phi1 += 2*Math.PI;
            let m = 10;
            console.log("phi0=",phi0," phi1=",phi1, "r0=", r0, " r1=", r1);
            for(let j=1; j<=m; j++) {
                let t = j/m;
                let phi = phi0 * (1-t) + phi1 * t;
                let r = r0 * (1-t) + r1 * t;
                let x = spiralCenter.x + r * Math.cos(phi);
                let y = spiralCenter.y + r * Math.sin(phi);
                this.draw.circle(3).fill('#ff0').move(x - 1.5, y - 1.5);   
            } 

            phi0 = phi1;
            r0 = r1; 

        }
    }
}

let scaleFactor = 1.0;

// Funzione drag che verrà chiamata durante il movimento
function drag(x, y, dx, dy) {
    // Qui puoi implementare la logica di trascinamento
    // Ad esempio, spostare il gruppo SVG:
    scaleFactor *= Math.exp(dx * 0.01);

    if (group) {
        group.untransform().scale(scaleFactor,0,0).translate(400,200);
    }
}

// squares.forEach(sq => {sq.x -= cx; sq.y -= cy;});

let model = new FibonacciSpiral();


window.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(TextPlugin);

    
    draw = SVG().addTo('#example4').size(1200, 800)
    model.createSVGElements(draw);
    model._spiralElement.hide();
    model.scaleFactor = 50.0;
    model.squareCount = 2;
    /*

    // gsap.to(squareElements.squares[3].svgElement.node, {scale:1, transformOrigin: "50% 50%"})


    const tl = gsap.timeline();

    group = draw.group();

    let u = 10;
    let sz = 1;
    squareElements = []; // Array per memorizzare gli elementi SVG

    function drawSquare(x,y,sz) {
        const rect = group.rect(u*sz,u*sz)
            .radius(2)
            .move(x*u, y*u)
            .stroke('#fff')
            .fill('none');
        rect.data = { x: x, y: y, size: sz };
        // Nascondi inizialmente il quadrato
        gsap.set(rect.node, { opacity: 0, scale: 0 });
        return rect;
    }

    function updateSquares(scaleFactor) {
        squareElements.forEach(rect => {
            let data = rect.data;
            rect.size(data.size * u * scaleFactor, data.size * u * scaleFactor);
            //rect.x(200 + data.x * scaleFactor * u);
            //rect.y(150 + data.y * scaleFactor * u);
            rect.untransform().translate(
                200 + data.x * scaleFactor * u, 
                150 + data.y * scaleFactor * u);
        });
    }

    // Crea tutti i quadrati e memorizzali nell'array
    for(let i=0;i<20;i++) {
        let sq = squares[i];
        const squareElement = drawSquare(sq.x, sq.y, sq.size);
        squareElements.push(squareElement);
    }
    updateSquares(scaleFactor);

    // Anima l'apparizione dei quadrati uno dopo l'altro
    
    for(let i=0;i<squareElements.length;i++) {
        tl.to(squareElements[i].node, {duration: 0.8, opacity: 1, scale:1})
    }

    updateSquares(0.5);

    // group.untransform().scale(1,0,0).translate(400,200);

    // Event listeners per il drag del mouse
    
     */
    const svgElement = draw.node;
    svgElement.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // Solo bottone sinistro
            isDragging = true;
            lastMouseX = event.clientX;
            lastMouseY = event.clientY;
            svgElement.style.cursor = 'grabbing';
            event.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const currentX = event.clientX;
            const currentY = event.clientY;
            const dx = currentX - lastMouseX;
            const dy = currentY - lastMouseY;
            
            // Chiama la funzione drag con posizione corrente e delta
            // drag(currentX, currentY, dx, dy);
            model.scaleFactor *= Math.exp(dx * 0.01);

            // Aggiorna la posizione precedente
            lastMouseX = currentX;
            lastMouseY = currentY;
        }
    });
    
    document.addEventListener('mouseup', (event) => {
        if (event.button === 0 && isDragging) {
            isDragging = false;
            svgElement.style.cursor = 'grab';
        }
    });
    
    // Imposta il cursore iniziale
    svgElement.style.cursor = 'grab';
   

});

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case '+':
            model.squareCount += 1;
            break;
        case '-':
            model.squareCount -= 1;
            break;

    }

});
