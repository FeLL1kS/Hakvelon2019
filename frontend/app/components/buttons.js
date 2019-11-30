export default function buttons(graph){
    let clearPerson1 = document.getElementById("clearPerson1");
    let clearPerson2 = document.getElementById("clearPerson2");
    let match = document.getElementById("match");

    clearPerson1.onclick = () => {
        graph.clearSelection(0);
    };
    clearPerson2.onclick = () => {
        graph.clearSelection(1);
    };
    match.onclick = () => {
        document.getElementById('toolbar').classList.toggle('active');
        graph.match(match);
    };
}


