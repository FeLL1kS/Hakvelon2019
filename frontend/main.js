import api from "./app/components/api";

import Graph from './app/class/Graph';

(async () => {
    try {
        const graph = new Graph('canvas');

        let persons = await api('user/getList');
        graph.build(persons);

        graph.animate();
    } catch(error) {
        console.log(error);
    }
})();