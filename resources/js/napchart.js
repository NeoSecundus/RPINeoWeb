var myNap;
function startNapChart() {
    fetch("/napchart/load", createHeader({})).then( (res) => {
        res.json().then( (json) => {
            let data;
            try {
                data = JSON.parse(json[0]["nap_data"]);
            } catch (err) {
                data = null;
            }

            runNapChart(data);
        }).catch( (err) => {
            console.log(err)
        });
    }).catch( (err) => {
        console.log(err);
    })
}

function runNapChart(data) {
    var ctx = document.getElementById("myNapchart").getContext('2d');

    if (data == null || data == undefined) {
        data = {
            elements: [],
            shape: 'circle',
            lanes: 1
        };
    }

    myNap = Napchart.init(ctx, data, {
        background: '#fff',
        fontColor: '#444'
    });

    addColorPicker(myNap);
}

function addColorPicker(myNap) {
    let colorMap = myNap.config.colorMap;
    let colorSelector = document.getElementById("napchart_colors");

    for (let color of Object.keys(colorMap)) {
        colorSelector.innerHTML += `<option value='${color}'>${color}</option>`;
    }
}

function napchartChangeColor() {
    let color = document.getElementById('napchart_colors').value;
    let showcase = document.getElementById('napchart_color_showcase');
    let desc = document.getElementById('napchart_desc');

    myNap.config.defaultColor = color;
    showcase.style.backgroundColor = myNap.config.colorMap[color];
    
    for (let tag of myNap.data.colorTags) {
        if (tag.color == color) {
            desc.value = tag.tag;
            break;
        }
        desc.value = "";
    }
}

function napchart_save() {
    let color = document.getElementById('napchart_colors').value;
    let desc = document.getElementById('napchart_desc').value;
    let found = false;

    for (let tag of myNap.data.colorTags) {
        if (tag.color == color) {
            tag.tag = desc;
            found = true;
            break;
        }
    }

    if (!found) {
        myNap.data.colorTags.push({"color":color, "tag":desc});
    }

    fetch("/napchart/save", createHeader(myNap.data)).then( () => {})
    .catch( (err) => {
        console.log(err);
    })
}