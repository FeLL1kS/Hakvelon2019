import api from "./app/components/api";

import Graph from './app/class/Graph';
import Person from './app/class/Person';

(async () => {
    try {
        const graph = new Graph('canvas');

        let persons = await api('user/getList');

        console.log(persons);
        persons.forEach((person, i) => {

        });
    } catch(error) {
        console.log(error);
    }
})();