const personRadius = 20;
const interestRadius = 10;
const interestDistance = 50;
const area = 2 * (personRadius + interestRadius + interestDistance + 20);
const circleNum = 3;
const circleDistance = 150;

let cnv = document.getElementById("octoquarium")
let ctx = cnv.getContext("2d");

class Person {
    constructor (interests, x, y){
        // this.imgage = image;
        this.interests = interests;
        this.pos = {
            x : x,
            y : y
        };
        
        this.startAngle = 2 * Math.PI * Math.random();
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y, personRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        
        let stepAngle = 2 * Math.PI / this.interests.length 
        for(let i in this.interests) {
            ctx.beginPath();
            let angle = i * stepAngle + this.startAngle
            let interestPos = {
                x : this.pos.x + interestDistance * Math.cos(angle),
                y : this.pos.y + interestDistance * Math.sin(angle)
            }
            ctx.arc(interestPos.x, interestPos.y, interestRadius, 0, 2 * Math.PI, false);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#003300';
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillText(this.interests[i], interestPos.x - this.interests[i].length * 0.5 * 5, interestPos.y);
            ctx.fill();
        }
    }

    update(){
        // this.pos.x += 1;
    }
}


let persons = [];
let numOfPersons = 10; 

let circleStepAngle = 2 * Math.PI / circleNum


for(let i=0; i<=numOfPersons; i++){
    let pos;
    if (i == 0){
        pos = {
            x : 400,
            y : 400
        };

    } else {
        radius = (Math.floor(i / (circleNum + 1)) + 1) * circleDistance;
        // console.log(radius);
        pos = {
            x : 400 + radius * Math.cos(circleStepAngle * (i - 1 + 0.5 * ((Math.floor(i / (circleNum + 1))) % 2))),
            y : 400 + radius * Math.sin(circleStepAngle * (i - 1 + 0.5 * ((Math.floor(i / (circleNum + 1))) % 2)))
        };
        console.log(((Math.floor(i / circleNum)) % 2));
    }
    
    let person = new Person(["Harry Potter", "Machine Learning", "Fitness"], pos.x, pos.y)

    
    persons.push(person);
}

function update(progress) {
    // Update the state of the world for the elapsed time since last render

    for(person of persons){
        person.update();
    }
}
  
function draw() {
    // Draw the state of the world
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, cnv.width, cnv.height);
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

