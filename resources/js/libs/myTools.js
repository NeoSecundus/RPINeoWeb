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
    let tryExec = setInterval( () => {
        try {
            window[func]();
            clearInterval(tryExec);
        } catch (re) {
            console.log("Waiting for script...");
        }
    }, 500)
}

function createChart(canvasId, type, labels, colors, myOptions, infotext="") {
    myOptions.aspectRatio = 1;
    if (infotext !== "") {
        myOptions.title = {
            display: true,
            text: infotext
        }
    }

    if (type === "bar" || type === "radar") {
        myOptions.legend = false;

        return new Chart(document.getElementById(canvasId), {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        data: [],
                        pointBackgroundColor: colors,
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
                pointBackgroundColor: colors[i],
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
