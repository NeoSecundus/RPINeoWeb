function createHeader(data, content_type = "application/json") {
    return {
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "content-type":content_type
        },
        body: JSON.stringify(data),
        method:"POST"
    };
}

function beginExecution(func) {
    let tries = 0;
    let tryExec = setInterval( () => {
        try {
            window[func]();
            clearInterval(tryExec);
        } catch (re) {
            console.log("Waiting for script...");
            tries++;
            if (tries >= 10)
                clearInterval(tryExec);
        }
    }, 500)
}

function __prepareChartOptions(options, rem, type, infotext) {
    options.aspectRatio = 1;
    options.legend = {
        labels: {
            fontSize: 0.6 * rem
        }
    };

    if (infotext !== "") {
        options.title = {
            display: true,
            text: infotext,
            fontSize: 0.8 * rem
        }
    }

    if (type === "radar" || type === "bar")  {
        options.legend = false;
        if (type === "radar") {
            if (options.scale !== undefined) {
                options.scale.pointLabels = {
                    fontSize: 0.5 * rem
                }
            } else {
                options.scale = {
                    pointLabels: {
                        fontSize: 0.5 * rem
                    }
                }
            }
        }
    }

    return options;
}

function createChart(canvasId, type, labels, colors, myOptions, infotext="") {
    let rem = parseInt(getComputedStyle(document.body).fontSize);

    myOptions = __prepareChartOptions(myOptions, rem, type, infotext);

    if (type === "bar" || type === "radar") {
        return new Chart(document.getElementById(canvasId), {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        data: [],
                        pointBackgroundColor: colors,
                        pointRadius: 0.3 * rem,
                        pointHoverRadius: 0.4 * rem,
                        backgroundColor: colors,
                        borderColor: "gray",
                        fill: false
                    }]
                },

                options: myOptions
            }
        );
    } else {
        mydatasets = [];
        for (let i = 0; i < labels.length; i++) {
            mydatasets.push({
                label: labels[i],
                data: [],
                lineTension: 0.2,
                pointBackgroundColor: colors[i],
                pointRadius: 0.2 * rem,
                pointHoverRadius: 0.3 * rem,
                backgroundColor: colors[i],
                borderColor: colors[i],
                fill: false
            })
        }

        return new Chart(document.getElementById(canvasId), {
                type: type,
                labels: [],
                data: {
                    datasets: mydatasets
                },

                options: myOptions
            }
        );
    }
}

function resetStatus(time = 3000) {
    setTimeout(() => {
        document.getElementById("status").innerHTML = "";
    }, time)
}

function formatDate(date = Date.now()) {
    date = new Date(parseInt(date));

    return `${date.getFullYear()}.` +
        `${date.getMonth()+1}`.padStart(2, '0') +
        "." + `${date.getDate()}`.padStart(2, '0') +
        " " + `${date.getHours()}`.padStart(2, '0') +
        ":" + `${date.getMinutes()}`.padStart(2, '0');
}

