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
        let dragged;
        this.canvas.addEventListener('mousedown', (event) => {
            document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
            lastX = event.offsetX || (event.pageX - this.canvas.offsetLeft);
            lastY = event.offsetY || (event.pageY - this.canvas.offsetTop);
            dragStart = this.ctx.transformedPoint(lastX, lastY);
            dragged = false;
        }, false);
        this.canvas.addEventListener('mousemove', (event) => {
            lastX = event.offsetX || (event.pageX - this.canvas.offsetLeft);
            lastY = event.offsetY || (event.pageY - this.canvas.offsetTop);
            dragged = true;
            if (dragStart) {
                let pt = this.ctx.transformedPoint(lastX, lastY);
                this.ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                draw();
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
        let p1 = this.ctx.transformedPoint(0, 0);
        let p2 = this.ctx.transformedPoint(this.canvas.width, this.canvas.height);
        this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        for (let person of this.persons) {
            person.draw(this.ctx);
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
}