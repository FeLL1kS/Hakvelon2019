export default function buttons(graph){
    let clearPerson1 = document.getElementById("clearPerson1");
    let clearPerson2 = document.getElementById("clearPerson2");
    
    clearPerson1.onclick = () => {
        graph.clearSelection(0);
        person1.value = "";
    }
    clearPerson2.onclick = () => {
        graph.clearSelection(1);
        person2.value = "";
    }
}


