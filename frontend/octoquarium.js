const personRadius = 50;
const interestRadius = 50;
const interestDistance = 120;
const area = 2 * (personRadius + interestRadius + interestDistance + 20);
const circleStartNum = 1;
const circleDistance = 420;
const maxCirlceDistance = 20;

let cnv = document.getElementById("octoquarium")
let ctx = cnv.getContext("2d");

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
            y: this.constPos.y + randomDirection() * maxCirlceDistance
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
let numOfPersons = 10;

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

