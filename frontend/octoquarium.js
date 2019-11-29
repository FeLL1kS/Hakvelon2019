const personRadius = 50;
const interestRadius = 50;
const interestDistance = 120;
const circleStartNum = 1;
const circleDistance = 430;
const maxCirlceDistance = 30;

let cnv = document.getElementById("octoquarium")
let ctx = cnv.getContext("2d");
trackTransforms(ctx);

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

function randomDirection(){
    return Math.random() * 2 - 1;
}


class Person {
    constructor (interests, x, y){
        // this.imgage = image;
        this.interests = interests;
        this.pos = {
            x : x,
            y : y
        };
        this.constPos = {
            x : x,
            y : y
        };

        this.generateNewAim();
        this.resetFlag();

        this.speed = Math.random() * 0.5;

        this.interestPos = []

        this.startAngle = 2 * Math.PI * Math.random();
        let stepAngle = 2 * Math.PI / this.interests.length

        for(let i in this.interests) {
            let angle = i * stepAngle + this.startAngle + (Math.random() - 0.5) * Math.PI / 3

            this.interestPos.push({
                x : this.pos.x + interestDistance * Math.cos(angle),
                y : this.pos.y + interestDistance * Math.sin(angle),
                a : angle
            })
        }
    }

    generateNewAim(){
        this.aim = {
            x : this.constPos.x + randomDirection() * maxCirlceDistance,
            y : this.constPos.y + randomDirection() * maxCirlceDistance
        }
    }

    resetFlag(){
        this.flag = {
            x : false,
            y : false
        }
    }

    draw(ctx) {

        //drawing main circle (avatar)
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y, personRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();


        for(let i in this.interests) {
            let interestX = this.pos.x + interestDistance * Math.cos(this.interestPos[i].a)
            let interestY = this.pos.y + interestDistance * Math.sin(this.interestPos[i].a)
            this.pos.y + interestDistance * Math.sin(this.interestPos[i].a)
            // drawing circle for interest
            ctx.beginPath();
            ctx.arc(interestX, interestY, interestRadius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#003300';
            ctx.stroke();

            // drawing tentacle
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.moveTo(this.pos.x + personRadius * Math.cos(this.interestPos[i].a),
                       this.pos.y + personRadius * Math.sin(this.interestPos[i].a));

            ctx.lineTo(interestX + interestRadius * Math.cos(this.interestPos[i].a + Math.PI),
                       interestY + interestRadius * Math.sin(this.interestPos[i].a + Math.PI));
            ctx.stroke();

            // drawing text
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillText(this.interests[i], interestX - this.interests[i].length * 0.5 * 5, interestY);
            ctx.fill();


        }
    }

    update(){
        this.flag.x = (
            this.aim.x > this.constPos.x && this.pos.x > this.aim.x ||
            this.aim.x < this.constPos.x && this.pos.x < this.aim.x
        );

        if (!this.flag.x) {
            if (this.pos.x > this.aim.x){
                this.pos.x -= this.speed;
            } else {
                this.pos.x += this.speed;
            }
        }

        this.flag.y = (
            this.aim.y > this.constPos.y && this.pos.y > this.aim.y ||
            this.aim.y < this.constPos.y && this.pos.y < this.aim.y
        );

        if (!this.flag.y) {
            if (this.pos.y > this.aim.y) {
                this.pos.y -= this.speed;
            } else {
                this.pos.y += this.speed;
            }
        }

        if (this.flag.x && this.flag.y) {
            this.generateNewAim();
            this.resetFlag();
        }
    }
}


let persons = [];
let numOfPersons = 50;

let circleNum = circleStartNum;
let circleCounter = 0;
let radiusCounter = 0;

let randomStartAngle = 2 * Math.PI * Math.random()

for(let i=0; i<numOfPersons; i++){
    let circleStepAngle = 2 * Math.PI / circleNum
    let pos;
    if (i == 0){
        pos = {
            x : window.innerWidth / 2,
            y : window.innerHeight / 2
        };

    } else {
        radius = radiusCounter * circleDistance
        pos = {
            x : window.innerWidth / 2 + radius * Math.cos(circleStepAngle * (i - 1) + randomStartAngle),
            y : window.innerHeight / 2 + radius * Math.sin(circleStepAngle * (i - 1) + randomStartAngle)
        };
    }

    let person = new Person(["Harry Potter", "Machine Learning", "Fitness"], pos.x, pos.y)


    persons.push(person);

    circleCounter++;

    if (circleCounter % circleNum == 0) {
        circleCounter = 1;

        circleNum += 6;
        radiusCounter++;
    }
}

function update(progress) {
    // Update the state of the world for the elapsed time since last render

    for(person of persons){
        person.update();
    }
}


function draw() {
    // Draw the state of the world
    // ctx.canvas.width  = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;

    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0,0);
    var p2 = ctx.transformedPoint(cnv.width,cnv.height);
    ctx.clearRect(p1.x,p1.y,p2.x-p1.x,p2.y-p1.y);

    for(person of persons){
        person.draw(ctx);
    }
}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}

let lastRender = 0;
window.requestAnimationFrame(loop);


var lastX=cnv.width/2, lastY=cnv.height/2;
var dragStart,dragged;
cnv.addEventListener('mousedown',function(evt){
    document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
    lastX = evt.offsetX || (evt.pageX - cnv.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - cnv.offsetTop);
    dragStart = ctx.transformedPoint(lastX,lastY);
    dragged = false;
},false);
cnv.addEventListener('mousemove',function(evt){
    lastX = evt.offsetX || (evt.pageX - cnv.offsetLeft);
    lastY = evt.offsetY || (evt.pageY - cnv.offsetTop);
    dragged = true;
    if (dragStart){
        var pt = ctx.transformedPoint(lastX,lastY);
        ctx.translate(pt.x-dragStart.x,pt.y-dragStart.y);
        draw();
    }
},false);
cnv.addEventListener('mouseup',function(evt){
    dragStart = null;
    if (!dragged) zoom(evt.shiftKey ? -1 : 1 );
},false);

var scaleFactor = 1.1;
var zoom = function(clicks){
    var pt = ctx.transformedPoint(lastX,lastY);
    ctx.translate(pt.x,pt.y);
    var factor = Math.pow(scaleFactor,clicks);
    ctx.scale(factor,factor);
    ctx.translate(-pt.x,-pt.y);
    draw();
}

var handleScroll = function(evt){
    var delta = evt.wheelDelta ? evt.wheelDelta/40 : evt.detail ? -evt.detail : 0;
    if (delta) zoom(delta);
    return evt.preventDefault() && false;
};
cnv.addEventListener('DOMMouseScroll',handleScroll,false);
cnv.addEventListener('mousewheel',handleScroll,false);


function trackTransforms(ctx){
    var svg = document.createElementNS("http://www.w3.org/2000/svg",'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function(){ return xform; };
    
    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function(){
        savedTransforms.push(xform.translate(0,0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function(){
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx,sy){
        xform = xform.scaleNonUniform(sx,sy);
        return scale.call(ctx,sx,sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians){
        xform = xform.rotate(radians*180/Math.PI);
        return rotate.call(ctx,radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx,dy){
        xform = xform.translate(dx,dy);
        return translate.call(ctx,dx,dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a,b,c,d,e,f){
        var m2 = svg.createSVGMatrix();
        m2.a=a; m2.b=b; m2.c=c; m2.d=d; m2.e=e; m2.f=f;
        xform = xform.multiply(m2);
        return transform.call(ctx,a,b,c,d,e,f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a,b,c,d,e,f){
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx,a,b,c,d,e,f);
    };
    var pt  = svg.createSVGPoint();
    ctx.transformedPoint = function(x,y){
        pt.x=x; pt.y=y;
        return pt.matrixTransform(xform.inverse());
    }
}