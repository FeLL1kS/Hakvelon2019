const radius = 40;
const interestRadius = 30;
const interestDistance = 100
const area = 2 * (radius + interestRadius + interestDistance + 20)

class Person {
    constructor (interests){
        // this.imgage = image;
        this.interests = interests;
        this.pos = {
            x : 500,
            y : 500
        }
        
        this.startAngle = 2 * Math.PI * Math.random()
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y, radius , 0, 2 * Math.PI, false);
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


let cnv = document.getElementById("octoquarium")
let ctx = cnv.getContext("2d");
let persons = []
for(let i=0; i<10; i++){
    let person = new Person(["Harry Potter", "Machine Learning", "Fitness"])
    persons.push(person)
}

function update(progress) {
    // Update the state of the world for the elapsed time since last render

    for(person of persons){
        person.update()
    }
}
  
function draw() {
    // Draw the state of the world
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.clearRect(0, 0, cnv.width, cnv.height);
    for(person of persons){
        person.draw(ctx)
    }
}

function loop(timestamp) {
let progress = timestamp - lastRender

update(progress)
draw()

lastRender = timestamp
window.requestAnimationFrame(loop)
}
let lastRender = 0
window.requestAnimationFrame(loop)

