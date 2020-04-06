"use strict";
function getCurrentRPIData(frames, labels) {
    const status = document.getElementById("status");
    let header = createHeader({"view":"now"});
    let json;

    fetch("/getrpidata", header).then( (res) => {
        json = res.json().then( (json) => {
            for (let i = 0; i < frames.length; i++) {
                if (i%2 === 0) {
                    let data = [];
                    for (let j = 0; j < labels[i].length; j++) {
                         data[j] = json[0][labels[i][j]];
                        if (data[j] <= 1 && data[j] >= 0)
                            data[j] *= 100;
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
    let timespan = "Now";
    try {
        timespan = document.getElementById("timespan").value;
    } catch (e) {
        return;
    }
    let header = createHeader({"view":timespan});
    let json;

    fetch("/getrpidata", header).then( (res) => {
        json = res.json().then( (json) => {
            for (let i = 0; i < frames.length; i++) {
                if (i%2 === 1) {
                    let e = 0;
                    let xLabels = [];
                    for (let e = 0; e < json.length; e++) {
                        let time = new Date(json[e]["id"]*1000);
                        xLabels[e] = `${time.getMonth()+1}`.padStart(2, '0') +
                            "." + `${time.getDate()}`.padStart(2, '0') +
                            " " + `${time.getHours()}`.padStart(2, '0') +
                            ":" + `${time.getMinutes()}`.padStart(2, '0');
                    }
                    frames[i].data.labels = xLabels;

                    for (let l = 0; l < labels[i].length; l++) {
                        let data = [];
                        for (let e = 0; e < json.length; e++) {
                            data[e] = json[e][labels[i][l]];
                            if (data[e] <= 1 && data[e] >= 0)
                                data[e] *= 100;
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
        return val < 50 ? "#33cc33bb" : val < 75 ? "#cc9944bb" : "#cc3333bb";
    },
        ["#3333cccc", "#cc3333cc", "#33cc33cc"],
        (context) => {
        let val = context.dataset.data[context.dataIndex];
        return val < 50 ? "#33cc33bb" : val < 75 ? "#cc9944bb" : "#cc3333bb";
    },
        ["#cc3333cc"]];

    let options = [
        {
            scale: {
                ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 20
                }
            }
        }, {
            scales: {
                xAxes: [{
                    ticks: {
                        maxTicksLimit: 8
                    }
                }]
            }
        }, {
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 100,
                        stepSize: 20
                    }
                }]
            }
        }, {
        scales: {
            xAxes: [{
                ticks: {
                    maxTicksLimit: 8
                }
            }]
        }}];
    let texts=["Resource usage in %", "Resource usage in %", "CPU Temperature in °C", "CPU Temperature in °C"];

    for (let i = 0; i < frameIds.length; i++) {
        frames[i] = createChart(frameIds[i], type[i], labels[i], colors[i], options[i], texts[i]);
    }

    getRPIData(frames, labels);
    getCurrentRPIData(frames, labels);
    rpiLoop(frames, labels);
}

function rpiLoop(frames, labels) {
    let loop = setInterval(() => {
        if (__PAGE__ !== "/monitoring.html")
            clearInterval(loop);
        
        getRPIData(frames, labels);
        getCurrentRPIData(frames, labels);
    }, 3000)
}
