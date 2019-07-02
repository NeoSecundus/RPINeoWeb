"use strict";
function getCurrentRPIData(frames, labels) {
    const status = document.getElementById("status");
    let header = createHeader({});
    let json;

    fetch("/getrpidata", header).then( (res) => {
        json = res.json().then( (json) => {
            for (let i = 0; i < frames.length; i++) {
                if (i%2 === 0) {
                    let data = [];
                    for (let j = 0; j < labels[i].length; j++) {
                         data[j] = json[0][labels[i][j]];
                    }
                    frames[i].data.datasets[0].data = data;

                    frames[i].update();
                }
            }
        });
    }).catch( (err) => {
        console.log(err);
        status.innerHTML = "Get RPI data failed!";
    });
}

function getRPIData(frames, labels) {
    const status = document.getElementById("status");
    let timestamp = Date.now() - (1000*60*60*24*30);
    let header = createHeader({"timestamp": timestamp});
    let json;

    fetch("/getrpidata", header).then( (res) => {
        json = res.json().then( (json) => {
            for (let i = 0; i < frames.length; i++) {
                if (i%2 === 1) {
                    let e = 0;
                    let xLabels = [];
                    for (let e = 0; e < json.length; e++) {
                        let time = new Date(json[e]["id"]*1000);
                        xLabels[e] = `${time.getDay()}.${time.getMonth()+1}`;
                    }
                    frames[i].data.labels = xLabels;

                    for (let l = 0; l < labels[i].length; l++) {
                        let data = [];
                        for (let e = 0; e < json.length; e++) {
                            data[e] = json[e][labels[i][l]];
                        }
                        frames[i].data.datasets[l].data = data;
                        e++;
                    }

                    frames[i].update();
                }
            }
        });
    }).catch( (err) => {
        console.log(err);
        status.innerHTML = "Get RPI data failed!";
    });
}

function startRPICharts() {
    let frames = [];
    let frameIds = ["curUsage", "timeUsage", "curTemp", "timeTemp"];
    let labels = [
        ["cpu_usage", "storage_usage", "ram_usage"],
        ["cpu_usage", "storage_usage", "ram_usage"],
        ["temp"],
        ["temp"]
    ];
    let type = ["radar", "line", "bar", "line"];

    let colors = [(context) => {
        let val = context.dataset.data[context.dataIndex];
        return val < 1 ?
            val < 0.5 ? "#33cc33bb" : val < 0.8 ? "#bb8833bb" : "#cc3333bb" :
            val < 50 ? "#33cc33bb" : val < 65 ? "#bb8833bb" : "#cc3333bb";
    },
        ["#3333cccc", "#cc3333cc", "#33cc33cc"],
        (context) => {
        let val = context.dataset.data[context.dataIndex];
        return val < 1 ?
            val < 0.5 ? "#33cc33bb" : val < 0.8 ? "#bb8833bb" : "#cc3333bb" :
            val < 50 ? "#33cc33bb" : val < 65 ? "#bb8833bb" : "#cc3333bb";
    },
        ["#cc3333cc"]];

    let options = [
        {
            scale: {
                ticks: {
                    min: 0,
                    max: 1,
                    stepSize: 0.2
                }
            }
        }, {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1,
                        stepSize: 0.2
                    }
                }]
            }
        }, {}, {}];
    let texts=["usage in %", "", "Temperature in °C", ""];

    for (let i = 0; i < frameIds.length; i++) {
        frames[i] = createChart(frameIds[i], type[i], labels[i], colors[i], options[i], texts[i]);
    }

    getRPIData(frames, labels);
    getCurrentRPIData(frames, labels);
    rpiLoop(frames, labels);
}

function rpiLoop(frames, labels) {
    let loop = setInterval((id) => {
        if (__PAGE__ !== "/monitoring.html")
            clearInterval(loop);
        
        getRPIData(frames, labels);
        getCurrentRPIData(frames, labels);
    }, 5000)
}