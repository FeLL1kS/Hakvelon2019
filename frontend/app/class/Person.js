import {
    PERSON_RADIUS,
    PERSON_MAX_NEW_AIM_DISTANCE,
    INTEREST_RADIUS,
    INTEREST_DISTANCE,
    MATCHED_PERSON_POS,
    MATCHED_INTEREST_DISTANCE
} from "../components/constants";

/**
 * @class Person
 */
export default class Person {
    constructor(person, x, y) {
        this.person = person;
        this.person.interests = this.person.interests.split(',').map(_ => _.trim()).filter(_ => _);
        this.pos = {
            x: x,
            y: y
        };
        this.constPos = {
            x: x,
            y: y
        };

        this.mouseDown = false;
        this.selected = false;

        this.mode = "circle"
        this.matchedID = 0;
        this.matchedPos = {
            x : 0,
            y : 0
        }
        this.matchedInterests = [];

        this.generateNewAim();
        this.resetFlag();

        this.speed = Math.random() * 0.5;

        this.interestPos = [];
        this.interestConstPos = [];

        this.startAngle = 2 * Math.PI * Math.random();
        let stepAngle = 2 * Math.PI / this.person.interests.length;

        for (let i in this.person.interests) {
            let angle = i * stepAngle + this.startAngle + (Math.random() - 0.5) * Math.PI / 9;

            this.interestPos.push({
                x: this.pos.x + INTEREST_DISTANCE * Math.cos(angle),
                y: this.pos.y + INTEREST_DISTANCE * Math.sin(angle),
                a: angle
            });
            this.interestConstPos.push({
                x: this.pos.x + INTEREST_DISTANCE * Math.cos(angle),
                y: this.pos.y + INTEREST_DISTANCE * Math.sin(angle),
                a: angle
            });
        }

        this.onclick = () => true;

        let avatar = new Image();
        avatar.src = '/uploads/' + this.person.user_id + '.jpg';
        avatar.onload = () => {
            this.avatar = avatar;
        };
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
        if (this.mode != "invisible"){
            if (this.mode == "circle"){
                let nameFlag = false;
                //drawing main circle (avatar)

                if (this.avatar)
                    ctx.drawImage(this.avatar, this.pos.x - PERSON_RADIUS, this.pos.y - PERSON_RADIUS, PERSON_RADIUS * 2, PERSON_RADIUS * 2);

                ctx.beginPath();
                ctx.arc(this.pos.x, this.pos.y, PERSON_RADIUS, 0, 2 * Math.PI, false);

                if (ctx.isPointInPath(mouse.x, mouse.y)) {
                    nameFlag = true;

                    if (this.mouseDown != mouse.down){
                        this.mouseDown = mouse.down
                        if (mouse.down) {
                            if (this.onclick()) {
                                this.selected = !this.selected;
                            }
                        }
                    }
                }

                ctx.lineWidth = 5;

                if (this.selected){
                    ctx.strokeStyle = "#e36d42";
                } else {
                    ctx.strokeStyle = '#003300';
                }

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
            } else if (this.mode == "match"){

                for (let i in this.matchedInterests) {
                    // drawing tentacle
                    ctx.fillStyle = "black";
                    ctx.moveTo(this.matchedPos.x, this.matchedPos.y);
                    ctx.lineTo(this.matchedInterests[i].pos.x,
                               this.matchedInterests[i].pos.y);
                    ctx.stroke();
                }

                let nameFlag = false;
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(this.matchedPos.x, this.matchedPos.y, PERSON_RADIUS, 0, 2 * Math.PI, false);

                if (ctx.isPointInPath(mouse.x, mouse.y)) {
                    nameFlag = true;

                    if (this.mouseDown != mouse.down){
                        this.mouseDown = mouse.down
                        if (mouse.down) {
                            if (this.onclick()) {
                                this.selected = !this.selected;
                            }
                        }
                    }
                }

                ctx.lineWidth = 5;

                if (this.selected){
                    ctx.strokeStyle = "#e36d42";
                }

                ctx.fill();
                ctx.stroke();

                if (nameFlag) {
                    // drawing name
                    ctx.beginPath();
                    ctx.fillStyle = "black";
                    ctx.fillText(this.person.name, this.matchedPos.x - this.person.name.length * 0.5 * 5, this.matchedPos.y);
                    ctx.fill();
                }


                for (let i in this.matchedInterests) {
                    // drawing circle for interest
                    ctx.beginPath();
                    ctx.fillStyle = "white";
                    ctx.arc(this.matchedInterests[i].pos.x, this.matchedInterests[i].pos.y, INTEREST_RADIUS, 0, 2 * Math.PI, false);
                    ctx.lineWidth = 5;
                    ctx.strokeStyle = '#003300';
                    ctx.fill();
                    ctx.stroke();

                    // drawing text
                    ctx.beginPath();
                    ctx.fillStyle = "black";
                    ctx.fillText(this.matchedInterests[i].label,
                                 this.matchedInterests[i].pos.x - this.matchedInterests[i].label.length * 0.5 * 5,
                                 this.matchedInterests[i].pos.y);
                    ctx.fill();
                }
            }
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

    generateMatchedInterests(interests){
        for (let i in interests.common){
            let interest = {
                pos : {
                    x : (this.matchedID == 0) ? (window.innerWidth / 2 - INTEREST_RADIUS * 2) : (window.innerWidth / 2 + INTEREST_RADIUS * 2),
                    y : window.innerHeight / 2 + Math.pow((-1),i) * Math.floor((i - 1)/ 2 + 1) * MATCHED_INTEREST_DISTANCE
                },
                label : interests.common[i]
            };
            this.matchedInterests.push(interest);
        }



        let startAngle = Math.PI / 2;
        let stepAngle = Math.PI / (interests[this.matchedID].length - 1);

        for (let i in interests[this.matchedID]){
            let angle = i * stepAngle + startAngle //+ (Math.random() - 0.5) * Math.PI / 9;
            let interest = {
                pos : {
                    x : (this.matchedID == 0) ? this.matchedPos.x + 2 * INTEREST_DISTANCE * Math.cos(angle) : this.matchedPos.x - 2 * INTEREST_DISTANCE * Math.cos(angle),
                    y : this.matchedPos.y + 2 * INTEREST_DISTANCE * Math.sin(angle),
                    a : angle
                },
                label : interests[this.matchedID][i]
            };

            this.matchedInterests.push(interest)
        }
    }

    resetMatchedInterests(){
        this.matchedInterests = [];
    }

    match(ID, interests,ctx) {
        this.resetMatchedInterests()
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(1, 1);

        this.mode = "match";
        this.matchedID = ID;
        this.matchedPos = MATCHED_PERSON_POS[this.matchedID];
        this.generateMatchedInterests(interests);
    }
}