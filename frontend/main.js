import api from "./app/components/api";

import Graph from './app/class/Graph';

import buttons from './app/components/buttons';

(async () => {
    try {
        const graph = new Graph('canvas');

        let persons = await api('user/getList');
        graph.build(persons);

        buttons(graph);

        graph.animate();
    } catch(error) {
        console.log(error);
    }
})();