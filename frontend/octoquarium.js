const personRadius = 50;
const interestRadius = 50;
const interestDistance = 120;
const area = 2 * (personRadius + interestRadius + interestDistance + 20);
const circleStartNum = 6;
const circleDistance = 420;
const epsilon = 4;

let cnv = document.getElementById("octoquarium")
let ctx = cnv.getContext("2d");

function randomDirection(){
    let rng =  Math.random();
    if (rng > 0.5){
        return 1;
    }
    else {
        return -1;
    }
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
        
        this.aim = {
            x : this.constPos.x + randomDirection() * 20,
            y : this.constPos.y + randomDirection() * 20
        }

        this.flag = {
            x : false,
            y : false
        }

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
            x : this.constPos.x + randomDirection() * 20,
            y : this.constPos.y + randomDirection() * 20
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
        if (Math.abs(this.pos.x - this.aim.x) > epsilon) {
            if (this.pos.x > this.aim.x){
                this.pos.x -= this.speed;
            } else {
                this.pos.x += this.speed;
            }
        } else {
            this.flag.x = true
            
        }

        if (Math.abs(this.pos.y - this.aim.y) > epsilon) {
            if (this.pos.y > this.aim.x){
                this.pos.y += this.speed;
            } else {
                this.pos.y -= this.speed;
            }
        } else {
            this.flag.y = true
            
        }

        console.log(this.flag);

        if (this.flag.x && this.flag.y) {
            this.generateNewAim();
            this.resetFlag();
        }
    }
}


let persons = [];
let numOfPersons = 6; 

let circleNum = circleStartNum;
let circleCounter = 0;
let radiusCounter = 1;

let randomStartAngle = 2 * Math.PI * Math.random()

for(let i=0; i<numOfPersons; i++){
    let circleStepAngle = 2 * Math.PI / circleNum
    let pos;
    if (i == 0){
        pos = {
            x : 700,
            y : 700
        };

    } else {
        // radius = (Math.floor(i  / (circleNum + 1) + 1)) * circleDistance
        radius = radiusCounter * circleDistance
        pos = {
            x : 700 + radius * Math.cos(circleStepAngle * (i - 1) + randomStartAngle),
            y : 700 + radius * Math.sin(circleStepAngle * (i - 1) + randomStartAngle)
        };
    }
    
    let person = new Person(["Harry Potter", "Machine Learning", "Fitness"], pos.x, pos.y)

    
    persons.push(person);
    
    circleCounter += 1;

    if (circleCounter - 1 == circleNum){
        circleCounter = 1;

        circleNum += 6;        
        radiusCounter += 1;
    }
    // console.log(circleStepAngle)
    
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

