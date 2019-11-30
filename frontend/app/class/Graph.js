import {
    GRAPH_ORBITAL_ADDON,
    GRAPH_ORBITAL_DISTANCE
} from "../components/constants";
import Person from './Person';

/**
 * @class Graph основной контейнер
 */
export default class Graph {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext("2d");

        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        let xform = svg.createSVGMatrix();
        this.ctx.getTransform = function () {
            return xform;
        };

        let savedTransforms = [];
        let save = this.ctx.save;
        this.ctx.save = () => {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(this.ctx);
        };
        let restore = this.ctx.restore;
        this.ctx.restore = () => {
            xform = savedTransforms.pop();
            return restore.call(this.ctx);
        };

        let scale = this.ctx.scale;
        this.ctx.scale = (sx, sy) => {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(this.ctx, sx, sy);
        };
        let rotate = this.ctx.rotate;
        this.ctx.rotate = (radians) => {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(this.ctx, radians);
        };
        let translate = this.ctx.translate;
        this.ctx.translate = (dx, dy) => {
            xform = xform.translate(dx, dy);
            return translate.call(this.ctx, dx, dy);
        };
        let transform = this.ctx.transform;
        this.ctx.transform = (a, b, c, d, e, f) => {
            let m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(this.ctx, a, b, c, d, e, f);
        };
        let setTransform = this.ctx.setTransform;
        this.ctx.setTransform = (a, b, c, d, e, f) => {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(this.ctx, a, b, c, d, e, f);
        };
        let pt = svg.createSVGPoint();
        this.ctx.transformedPoint = (x, y) => {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        };

        this.scaleFactor = 1.1;

        let lastX = this.canvas.width / 2;
        let lastY = this.canvas.height / 2;
        let dragStart;
        this.canvas.addEventListener('mousedown', (event) => {
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            lastX = event.offsetX || (event.pageX - this.canvas.offsetLeft);
            lastY = event.offsetY || (event.pageY - this.canvas.offsetTop);
            dragStart = this.ctx.transformedPoint(lastX, lastY);
        }, false);
        this.canvas.addEventListener('mousemove', (event) => {
            lastX = event.offsetX || (event.pageX - this.canvas.offsetLeft);
            lastY = event.offsetY || (event.pageY - this.canvas.offsetTop);
            if (dragStart) {
                let pt = this.ctx.transformedPoint(lastX, lastY);
                this.ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                this.draw();
            }
        }, false);
        this.canvas.addEventListener('mouseup', (event) => {
            dragStart = null;
        }, false);


        const zoom = (delta) => {
            let pt = this.ctx.transformedPoint(lastX, lastY);
            this.ctx.translate(pt.x, pt.y);
            let factor = Math.pow(this.scaleFactor, delta);
            this.ctx.scale(factor, factor);
            this.ctx.translate(-pt.x, -pt.y);
            this.draw();
        };
        const handleScroll = (event) => {
            let delta = event.wheelDelta ? event.wheelDelta / 40 : event.detail ? -event.detail : 0;
            if (delta) zoom(delta);
            return event.preventDefault() && false;
        };
        this.canvas.addEventListener('DOMMouseScroll', handleScroll, false);
        this.canvas.addEventListener('mousewheel', handleScroll, false);

        this.mouse = {
            x : 0,
            y : 0,
            down : false
        }

        this.canvas.onmousemove = (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        }

        this.canvas.onmousedown = (e) => {
            this.mouse.down = true;
        }

        this.canvas.onmouseup = (e) => {
            this.mouse.down = false;
        }

        this.persons = [];

        this.selectedPersons = [null,null];
        this.inputs = [document.getElementById("person1"), document.getElementById("person2")];
    }

    build(persons) {
        let circleNum = 1;
        let circleCounter = 0;
        let radiusCounter = 0;
        let randomStartAngle = 2 * Math.PI * Math.random();

        this.persons = persons.map((person, i) => {
            let circleStepAngle = 2 * Math.PI / circleNum;
            let pos;
            if (i) {
                let radius = radiusCounter * GRAPH_ORBITAL_DISTANCE;
                pos = {
                    x: window.innerWidth / 2 + radius * Math.cos(circleStepAngle * (i - 1) + randomStartAngle),
                    y: window.innerHeight / 2 + radius * Math.sin(circleStepAngle * (i - 1) + randomStartAngle)
                };
            } else {
                pos = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                };
            }

            circleCounter++;

            if (circleCounter % circleNum == 0) {
                circleCounter = 1;

                circleNum += GRAPH_ORBITAL_ADDON;
                radiusCounter++;
            }

            let personObject = new Person(person, pos.x, pos.y, this.canvas);


            personObject.onclick = () => {
                if (!this.selectedPersons[0]) {
                    this.selectedPersons[0] = personObject;
                    this.inputs[0].value = this.selectedPersons[0].person.name;
                    return true;
                } else if (this.selectedPersons[0] == personObject){
                    this.selectedPersons[0] = null;
                    this.inputs[0].value = "";
                    return true;
                }
                if (!this.selectedPersons[1]) {
                    this.selectedPersons[1] = personObject;
                    this.inputs[1].value = this.selectedPersons[1].person.name;
                    return true;
                } else if (this.selectedPersons[1] == personObject){
                    this.selectedPersons[1] = null;
                    this.inputs[1].value = "";
                    return true;
                }

                return false;
            }
            return personObject;
        });
        console.log(this.persons);
    }

    update() {
        for (let person of this.persons) {
            person.update();
        }
    }

    draw() {
        let p1 = this.ctx.transformedPoint(0, 0);
        let p2 = this.ctx.transformedPoint(this.canvas.width, this.canvas.height);
        this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        for (let person of this.persons) {
            person.draw(this.ctx, this.mouse);
        }
    }

    animate() {
        const loop = (timestamp) => {
            this.update();
            this.draw();

            window.requestAnimationFrame(loop);
        };
        window.requestAnimationFrame(loop);
    }


    clearSelection(selectionID){
        if (this.selectedPersons[selectionID]) {
            this.selectedPersons[selectionID].selected = false;
        }
        this.selectedPersons[selectionID] = null;
        this.inputs[selectionID].value = "";
    }

    match(){
        if (this.selectedPersons[0] && this.selectedPersons[1]) { 
            let matchButton = document.getElementById("match");
            if (matchButton.innerHTML == "Match") {
                matchButton.innerHTML = "Back";
            } else {
                this.clearSelection(0);
                this.clearSelection(1);

                
                matchButton.value = "Match";
                return;
            }

            let interests = {
                0 : [], 
                1 : [],
                common : []
            };

            let interests0 = [...this.selectedPersons[0].person.interests];
            let interests1 = [...this.selectedPersons[1].person.interests];

            for (let i in this.selectedPersons[0].person.interests){
                if (interests1.includes(this.selectedPersons[0].person.interests[i])){
                    interests.common.push(this.selectedPersons[0].person.interests[i]);

                    interests1.splice(interests1.indexOf(this.selectedPersons[0].person.interests[i]), 1);
                    interests0.splice(i, 1);                    
                }
            }

            interests[0] = interests0.slice();
            interests[1] = interests1.slice();
            console.log(interests);

            this.selectedPersons[0].match(0, interests, this.ctx);
            this.selectedPersons[1].match(1, interests, this.ctx);

            for (let person of this.persons){
                if ((person != this.selectedPersons[0]) && (person != this.selectedPersons[1])) {
                    person.mode = "invisible";
                }
            }
        }
    }

}