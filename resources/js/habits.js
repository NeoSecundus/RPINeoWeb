let habitsDiv;
let habitsLoad;

function getHabitDocElements() {
    habitsDiv = document.getElementById("habits");
    habitsLoad = document.getElementById("load_habits");
    habitsLoad.style.display = "none";
}

function getHabits() {
    getHabitDocElements();
    habitsLoad.style.display = "block";

    fetch("habits/gethabits", createHeader({})).then( (res) => {
        res.json().then( (json) => {
            let insert = "";
            let now = `${new Date().getFullYear()}-${( "0" + (new Date().getMonth()+1)).slice(-2)}-${( "0" + new Date().getDate()).slice(-2)}`
            let last = `${new Date(Date.now()-2592e6).getFullYear()}-${( "0" + (new Date(Date.now()-2592e6).getMonth()+1)).slice(-2)}-${( "0" + new Date(Date.now()-2592e6).getDate()).slice(-2)}`

            if (json[0]) {
                for (let i in json) {
                    insert += `
                    <details style="margin-left:.5rem;" onclick="getTracks(${json[i]["id"]}, ${i}, true)">
                        <summary><input class="habit-base" style="width: 92%; border: none;" value="${json[i]["title"]}"/></summary>
                        <textarea class="habit-base" rows=2 style="width: 95%; margin-top:.4rem; font-size: .8rem" maxlength="127" >${json[i]["desc"]}</textarea><br/>
                        <span style="font-size: 0.7rem;">Added: ${formatDate(json[i]["id"])}</span>
                        <span style="margin-left:40%">
                            <button onclick="updateHabit(${json[i]["id"]}, ${i})">Save</button>
                            <button onclick="deleteHabit(${json[i]["id"]});">
                                <img style="height: 1.5rem; margin: -0.15rem 0 -0.45rem 0;" alt="Delete" src="/resources/images/icons/trash.png">
                            </button>
                        </span>
                        <hr style="border: 1px dashed gray; width: 92%;"/>
                        <div style="display: grid; grid-template-columns: 33% 65%">
                            <div style="font-size:.8rem; margin-top: .4em; line-height: 1.5rem;">
                                <strong>Show timespan:</strong> <br/>
                                From: <input class="habit-base" style="width:8em" id="habitFrom${i}" type="date" value="${last}" onchange="getTracks(${json[i]["id"]}, ${i})"></input> <br/>
                                To: <input class="habit-base" style="width:8em" id="habitTo${i}" type="date" value="${now}" onchange="getTracks(${json[i]["id"]}, ${i})"></input> <br/>
                                <span class="habit-base" style="font-size: inherit;" id="habitCounter${i}">Done: ?/? ?%</span>
                            </div>
                            <div id="habitTracks${i}" style="margin-right: 3%; font-size: 0.8em; display: grid; grid-template-columns: auto auto auto auto auto auto auto">...
                            </div>
                        </div>
                        </details>
                    <hr/>`;
                }
            }

            habitsDiv.innerHTML = insert;
            habitsLoad.style.display = "none";
        }).catch( (err) => {
            console.log(err)
        })
    }).catch( (err) => {
        console.log(err)
    })
}

function addHabit() {
    fetch("habits/addhabit", createHeader({
        "create_date":Date.now(), 
        "title":"Empty Habit", 
        "desc":"Description goes here..."})).then( () => {
            getHabits();
        }).catch( err => {
            console.log(err);
    });
}

function updateHabit(id, pos) {
    let details = document.getElementsByTagName("details")[pos];
    let title = details.children[0].children[0].value;
    let desc = details.children[1].value;

    fetch("habits/updatehabit", createHeader({
        "id":id, 
        "title":title, 
        "desc":desc})).then( () => {
            getHabits();
        }).catch( err => {
            console.log(err);
    });
}

function deleteHabit(id) {
    fetch("habits/deletehabit", createHeader({"id":id}))
        .then( () => {
            getHabits();
        }).catch( err => {
            console.log(err);
    });
}

function loadTrackPictures() {
    fetch("resources/images/icons/good_habit_track.png").then( res => {
        res.arrayBuffer().then( data => {
            localStorage.setItem("good_track_pic", imageToBase64(data));
        });
    }).catch(err => {
        console.log(err);
    })

    fetch("resources/images/icons/bad_habit_track.png").then( res => {
        res.arrayBuffer().then( data => {
            localStorage.setItem("bad_track_pic", imageToBase64(data));
        });
    }).catch(err => {
        console.log(err);
    })
}

function getTracks(id, pos, checkopen = false) {
    if (document.getElementsByTagName("details")[pos].open && checkopen) {
        return;
    }

    if (localStorage.getItem("good_track_pic") === null 
        || localStorage.getItem("bad_track_pic") === null) {
            loadTrackPictures();
    }

    setTimeout(() => {}, 1000);
    
    let trackDiv = document.getElementById(`habitTracks${pos}`);
    let counterSpan = document.getElementById(`habitCounter${pos}`);
    let from = Date.parse(document.getElementById("habitFrom"+pos).value);
    let to = Date.parse(document.getElementById("habitTo"+pos).value);
    let timespan = (to-from)/86400000 + 1;
    
    fetch("habits/gettracks", createHeader({"habit_id":id}))
        .then( res => {
            res.json().then( json => {
                let insert = "";
                let counter = 0;

                let curDate = new Date();
                let dateString = curDate.getFullYear() + ("0" + (curDate.getMonth() + 1)).slice(-2) + ("0" + curDate.getDate()).slice(-2);
                let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                for (let i in days) {
                    insert += "<p class='habit-field' style='font-weight: bold; border: .1em solid black;'>" + days[i] + "</p>";
                }

                let dayOfWeek = new Date(from).getDay();
                for (let i = 0; i < dayOfWeek; i++) {
                    insert += "<p class='habit-field'></p>";
                }

                for (let i = 0; i < timespan; i++) {
                    let pic = "bad_track_pic";
                    let checked = false;
                    curDate = new Date(from + 86400000*i);
                    let dateid = curDate.getFullYear() + 
                                ("0" + (curDate.getMonth() + 1)).slice(-2) + 
                                ("0" + curDate.getDate()).slice(-2);

                    dateString = curDate.getFullYear() + ("0" + (curDate.getMonth() + 1)).slice(-2) + ("0" + curDate.getDate()).slice(-2);
                    for (let j in json) {
                        if (dateString == json[j]["date"]) {
                            pic = "good_track_pic";
                            checked = true;
                            counter++;
                            break;
                        }
                    }

                    insert += "<p class='habit-field'>"
                    insert += curDate.toLocaleDateString("loc", {"day":"numeric", "month":"numeric"}) + "<br/>";
                    insert += `<img style="width:0.9em;" src='${localStorage.getItem(pic)}' alt="track icon" onclick="updateHabitStatus(${id}, ${pos}, ${checked}, ${dateid})"/>`;
                    insert += "</p>"
                }

                trackDiv.innerHTML = insert;
                counterSpan.innerHTML= `Done: ${counter}/${timespan} ${(counter*100/timespan).toPrecision(2)}%`;
            }).catch( err => {
                console.log(err);
            });
        }).catch( err => {
            console.log(err);
    });
}

function updateHabitStatus(id, pos, checked, dateid) {
    let url;
    if (checked) {
        url = "habits/deletetrack";
    } else {
        url = "habits/addtrack";
    }

    fetch(url, createHeader({
        "habit_id":id, 
        "date":dateid})).then( () => {
            getTracks(id, pos);
        }).catch( err => {
            console.log(err);
    });
}
