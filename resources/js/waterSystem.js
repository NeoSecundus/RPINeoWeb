function addPump() {
    id = document.getElementById("wsid").value;
    host = document.getElementById("wshost").value;
    port = document.getElementById("wsport").value;

    if (id < 1 || id > 1000) {
        writeStatus("ID " + id + " out of viable range! (1-1000)", "orange");
        return;
    }

    if (host == undefined || host == null || host == "") {
        writeStatus("Host must not be empty!", "orange");
        return;
    }

    if (port < 1 || port > 65535) {
        writeStatus("Port " + port + " outside of valid port range! (1-65535)", "orange");
        return;
    }

    fetch("/wsc/addpump", createHeader({"id": id, "host": host, "port": port})).then( (res) => {
        res.json().then( (json) => {
            console.log("JSON:", json);
            if (json["status"]) {
                writeStatus("Successfully added Pump!");
            } else {
                writeStatus("Failed to add Pump! Reason: " + json["msg"], "red");
            }
        }).catch( (err) => {
            console.log(err);
            writeStatus("Could not parse Response!", "orange");
        });
    }).catch( (err) => {
        console.log(err);
        writeStatus("Could not add Pump!", "red");
    });
}

function getPumpSelection() {
    fetch("/wsc/getpumps", createHeader([])).then( (res) => {
        res.json().then( (json) => {
            if (json["status"] == false) {
                writeStatus("Failed to get Pumps!", "red");
                return;
            }
            
            let pumpSelector = document.getElementById("pumpSelection");
            pumpSelector.innerHTML = "";
            for (elem in json) {
                pumpSelector.innerHTML += `
                <option>${json[elem]["host"]}</option>
                `
            }
        }).catch( (err) => {
            writeStatus("Failed to parse Json!", "orange");
            console.log(err);
        })
    }).catch( (err) => {
        writeStatus("Failed to send request!", "orange");
        console.log(err);
    })
}

function getPumpData() {
    host = document.getElementById("pumpSelection").value;
    
    fetch("/wsc/getpumpbyhost", createHeader({"host": host})).then( (res) => {
        res.json().then( (json) => {
            if (json["status"] == false) {
                writeStatus("Failed to get pump! Reason: " + json["msg"]);
                return;
            }

            document.getElementById("pump_host").value = json[0]["host"];
            document.getElementById("pump_port").value = json[0]["port"];
            document.getElementById("low_thresh").value = json[0]["low_thresh"];
            document.getElementById("high_thresh").value = json[0]["high_thresh"];
            document.getElementById("watering_time").value = json[0]["watering_time"];
            document.getElementById("watering_delay").value = json[0]["watering_delay"];
        }).catch( (err) => {
            writeStatus("Failed to parse Json!", "orange");
        })
    }).catch( (err) => {
        writeStatus("Failed to send request!", "orange");
        console.log(err);
    });
}

function updatePump() {
    data = {
        "host": document.getElementById("pump_host").value,
        "port": document.getElementById("pump_port").value,
        "low_thresh": document.getElementById("low_thresh").value,
        "high_thresh": document.getElementById("high_thresh").value,
        "watering_time": document.getElementById("watering_time").value,
        "watering_delay": document.getElementById("watering_delay").value
    }
    document.getElementById("loading").style.display = "inline-block";

    fetch("/wsc/updatepump", createHeader(data)).then( (res) => {
        res.json().then( (json) => {
            if (json["status"]) {
                writeStatus("Update Successfull!<br/>May take up to 3 seconds to show!");
            } else {
                writeStatus("Failed to change pump! Reason: " + json["msg"], "red");
            }
        }).catch( (err) => {
            writeStatus("Failed to parse Json!", "orange");
        })
    }).catch( (err) => {
        writeStatus("Failed to send request!", "orange");
        console.log(err);
    }).finally( () => {
        document.getElementById("loading").style.display = "none";
        setTimeout(()=>{getPumpData()}, 3000);
    });
}

function getWSData() {
    fetch("/wsc/getpumps", createHeader([])).then( (res) => {
        res.json().then( (json) => {
            if (json["status"] == false) {
                writeStatus("Failed to get Pumps!", "red");
                return;
            }
            
            let pumpListing = document.getElementById("pumpListing");
            pumpListing.innerHTML = "";
            let pumps = [];
            for (elem in json) {
                pumpListing.innerHTML += `
                <h3>${json[elem]["host"]}:<h3/>
                <div class="graph" tabindex="-1">
                    <canvas id="${json[elem]["id"]}"></canvas>
                </div>
                <hr/>
                `
                pumps.push(json[elem]["id"]);
            }

            setTimeout(updatePumpGraphs, 3000, pumps, initGraphs(pumps));
        }).catch( (err) => {
            writeStatus("Failed to parse Json!", "orange");
            console.log(err);
        })
    }).catch( (err) => {
        writeStatus("Failed to send request!", "orange");
        console.log(err);
    });
}

function updatePumpGraphs(pumps, frames) {
    let graphs = document.getElementsByClassName("graph");
    if (graphs.length == 0) {
        return;
    }
    let timespan = document.getElementById("timespan").value;

    fetch("/wsc/getwsdata", createHeader({"timespan": timespan})).then( (res) => {
        res.json().then( json => {
            for (frame_id in frames) {
                frames[frame_id].data.labels = [];
                frames[frame_id].data.datasets[0].data = [];
            }

            for (elem in json) {
                elem = json[elem];
                id = elem["pump_id"];
                let time = new Date(elem["date"]*1000);
                let xlabel = `${time.getMonth()+1}`.padStart(2, '0') +
                            "." + `${time.getDate()}`.padStart(2, '0') +
                            " " + `${time.getHours()}`.padStart(2, '0') +
                            ":" + `${time.getMinutes()}`.padStart(2, '0');

                frames[id].data.labels.push(xlabel);
                frames[id].data.datasets[0].data.push(elem["humidity"]);
            }

            for (frame_id in frames) {
                frames[frame_id].update();
            }

        }).catch( (err) => {
            console.log(err);
            writeStatus("Failed to update Graphs! Failed to parse data!", "red");
        })
    }).catch( (err) => {
        writeStatus("Failed to update Graphs! Connection error!", "red");
    }).finally(() => {
        setTimeout(updatePumpGraphs, 5000, pumps, frames);
    })
}

function initGraphs(ids) {
    let frames = {};
    let color = ["#3388cccc"];
    let type = "line";
    let option = {
        scales: {
            xAxes: [{
                ticks: {
                    maxTicksLimit: 8
                }
            }]
        }
    }
    let label = ["HUM"];
    let text="Soil Humidity in %";

    for (let i = 0; i < ids.length; i++) {
        frames[ids[i]] = createChart(ids[i], type, label, color, option, text);
    }

    return frames;
}