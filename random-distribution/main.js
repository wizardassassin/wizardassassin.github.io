const labels = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine'
];

const data = {
    labels: labels,
    datasets: [{
        label: 'Distribution',
        backgroundColor: 'rgb(0, 100, 255)',
        borderColor: 'rgb(255, 255, 255)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }]
};

const options = {

};

const config = {
    type: 'bar',
    data,
    options
};

var myChart = new Chart(
    document.getElementById('myChart'),
    config
);

var dSet = myChart.data.datasets[0];

var type;

var time = Date.now();
var iter = 0;
var wait = 100;
var freq = 1;
var log = freq * 1000 / wait;
var lim = 20;

setInterval(addValue, wait);

function addValue() {
    dSet.data[random(type)]++;
    // dSet.data[10] = Math.max(...dSet.data.slice(0, -1)) * 1.25;
    myChart.update();
    iter++;
    if (iter % log == 0)
        table();
}

function table() {
    let dSet2 = dSet.data.slice(0, -1);
    let cols = [iter, ((Date.now() - time) / iter).toFixed(3), Math.max(...dSet2) - Math.min(...dSet2)];
    const parentTbl = document.getElementById('rows');
    const newTr = document.createElement('tr');
    for (let values of cols) {
        const newTd = document.createElement('td');
        newTd.innerHTML = values;
        newTr.appendChild(newTd);
    }
    parentTbl.insertBefore(newTr, parentTbl.childNodes[0]);
    console.log(cols);
    if (parentTbl.children.length > lim) {
        while (parentTbl.children[lim])
            parentTbl.removeChild(parentTbl.children[lim]);
    }
}

function random(type) {
    switch (type) {
        case "CS":
            return randomCS();
        case "NS":
            return randomNS();
        default:
            return randomNS();
    }
}

function randomCS() {
    let buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] % 10;
}

function randomNS() {
    return Math.floor(Math.random() * 10);
}