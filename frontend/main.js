import api from "./app/components/api";

import Graph from './app/class/Graph';
import Person from './app/class/Person';

(async () => {
    try {
        const graph = new Graph('canvas');

        let persons = await api('user/getList');

        console.log(persons);
        persons.forEach((person, i) => {
            let circleStepAngle = 2 * Math.PI / circleNum
            let pos;
            if (i == 0) {
                pos = {
                    x: 700,
                    y: 700
                };

            } else {
                // radius = (Math.floor(i  / (circleNum + 1) + 1)) * circleDistance
                radius = radiusCounter * circleDistance
                pos = {
                    x: 700 + radius * Math.cos(circleStepAngle * (i - 1) + randomStartAngle),
                    y: 700 + radius * Math.sin(circleStepAngle * (i - 1) + randomStartAngle)
                };
            }
        });
    } catch(error) {
        console.log(error);
    }
})();