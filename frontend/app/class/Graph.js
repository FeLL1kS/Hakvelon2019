/**
 * @class Graph основной контейнер
 */
export default class Graph {
    constructor(canvas_id) {
        this.canvas = document.getElementById(canvas_id);
        this.ctx = this.canvas.getContext("2d");

        this.scale = 1;
    }

    scale(scale) {
        // TODO: scale
    }
}