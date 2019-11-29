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

        this.scale = 1;

        this.persons = [];
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

            return new Person(person, pos.x, pos.y);
        });
        console.log(this.persons);
    }

    update() {
        for (let person of this.persons) {
            person.update();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let person of this.persons) {
            person.draw(this.ctx);
        }
    }

    scale(scale) {
        // TODO: scale
    }

    animate() {
        const loop = (timestamp) => {
            this.update();
            this.draw();

            window.requestAnimationFrame(loop);
        }
        window.requestAnimationFrame(loop);
    }
}