import {
    PERSON_RADIUS,
    PERSON_MAX_NEW_AIM_DISTANCE,
    INTEREST_RADIUS,
    INTEREST_DISTANCE
} from "../components/constants";

/**
 * @class Person
 */
export default class Person {
    constructor(person, x, y, canvas) {
        this.person = person;
        this.pos = {
            x: x,
            y: y
        };
        this.constPos = {
            x: x,
            y: y
        };

        this.generateNewAim();
        this.resetFlag();

        this.speed = Math.random() * 0.5;

        this.interestPos = [];

        this.startAngle = 2 * Math.PI * Math.random();
        let stepAngle = 2 * Math.PI / this.person.interests.length;

        for (let i in this.person.interests) {
            let angle = i * stepAngle + this.startAngle + (Math.random() - 0.5) * Math.PI / 3;

            this.interestPos.push({
                x: this.pos.x + INTEREST_DISTANCE * Math.cos(angle),
                y: this.pos.y + INTEREST_DISTANCE * Math.sin(angle),
                a: angle
            });
        }
    }

    generateNewAim() {
        this.aim = {
            x: this.constPos.x + (Math.random() * 2 - 1) * PERSON_MAX_NEW_AIM_DISTANCE,
            y: this.constPos.y + (Math.random() * 2 - 1) * PERSON_MAX_NEW_AIM_DISTANCE
        };
    }

    resetFlag() {
        this.flag = {
            x: false,
            y: false
        };
    }

    draw(ctx, mouse) {
        let nameFlag = false;
        //drawing main circle (avatar)
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, PERSON_RADIUS, 0, 2 * Math.PI, false);

        if (ctx.isPointInPath(mouse.x, mouse.y)) {
            nameFlag = true;
        }        

        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();

        if (nameFlag) {
            // drawing name
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillText(this.person.name, this.pos.x - this.person.name.length * 0.5 * 5, this.pos.y);
            ctx.fill();
        }


        for (let i in this.person.interests) {
            let interestX = this.pos.x + INTEREST_DISTANCE * Math.cos(this.interestPos[i].a);
            let interestY = this.pos.y + INTEREST_DISTANCE * Math.sin(this.interestPos[i].a);
            // drawing circle for interest
            ctx.beginPath();
            ctx.arc(interestX, interestY, INTEREST_RADIUS, 0, 2 * Math.PI, false);
            ctx.lineWidth = 5;
            ctx.strokeStyle = '#003300';
            ctx.stroke();

            // drawing tentacle
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.moveTo(this.pos.x + PERSON_RADIUS * Math.cos(this.interestPos[i].a),
                this.pos.y + PERSON_RADIUS * Math.sin(this.interestPos[i].a));

            ctx.lineTo(interestX + INTEREST_RADIUS * Math.cos(this.interestPos[i].a + Math.PI),
                interestY + INTEREST_RADIUS * Math.sin(this.interestPos[i].a + Math.PI));
            ctx.stroke();

            // drawing text
            ctx.beginPath();
            ctx.fillStyle = "black";
            ctx.fillText(this.person.interests[i], interestX - this.person.interests[i].length * 0.5 * 5, interestY);
            ctx.fill();
        }


    }

    update() {
        this.flag.x = (
            this.aim.x > this.constPos.x && this.pos.x > this.aim.x ||
            this.aim.x < this.constPos.x && this.pos.x < this.aim.x
        );

        if (!this.flag.x) {
            if (this.pos.x > this.aim.x) {
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