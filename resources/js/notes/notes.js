let noteDiv;
let noteGroupDiv;
let loadNotes;
let loadGroups;

function getNoteDocElements() {
    noteDiv = document.getElementById("notes");
    noteGroupDiv = document.getElementById("notegroups");
    loadNotes = document.getElementById("load_notes");
    loadNotes.style.display = "none";
    loadGroups = document.getElementById("load_groups");
    loadGroups.style.display = "none";

    showdown.setOption('parseImgDimensions', true);
    showdown.setOption('simplifiedAutoLink', true);
    showdown.setOption('strikethrough', true);
    showdown.setOption('tables', true);
    showdown.setOption('tasklists', true);
    showdown.setOption('smoothLivePreview', true);
    showdown.setFlavor('github');
}

function checkForMdPreviews() {
    let tas = noteDiv.getElementsByTagName("textarea");
    for (let i = 0; i < tas.length; i++) {
        tas[i].addEventListener("keyup", (e) => {
            let text = tas[i].value;
            let div = tas[i].parentElement.getElementsByClassName("md-preview")[0];

            let converter = new showdown.Converter();
            div.innerHTML = converter.makeHtml(text);
        });

        let text = tas[i].value;
        let div = tas[i].parentElement.getElementsByClassName("md-preview")[0];

        let converter = new showdown.Converter();
        div.innerHTML = converter.makeHtml(text);
    }
}

function getNotes(group, color) {
    loadNotes.style.display = "block";

    fetch("notes/getnotes", createHeader({"group": group})).then( (res) => {
        res.json().then( (json) => {
            let insert = "";

            if (json[0]) {
                for (let i in json) {
                    insert += `
                    <details style="background-color: ${color}">
                        <summary><input class="emoji-support" style="width: 92%; background-color: ${color}; border: none" value="${json[i]["title"]}"/></summary>
                        <textarea rows=8 class="emoji-support" style="width: 99%;  background-color: ${color}" >${json[i]["text"]}</textarea><br/>
                        <div class="md-preview"></div>
                        <span style="font-size: 0.75rem;">Added: ${formatDate(json[i]["create_date"])}</span>
                        <span style="margin: 0 0 0 40%">
                            <button onclick="updateNote('${json[i]["title"].replace(/'/g, "\\'")}', '${json[i]["group_title"].replace(/'/g, "\\'")}', ${i}, '${color}');">Save</button>
                            <button onclick="deleteNote('${json[i]["title"].replace(/'/g, "\\'")}', '${json[i]["group_title"].replace(/'/g, "\\'")}', '${color}');">
                                <img style="height: 1.5rem; margin: -0.15rem 0 -0.45rem 0;" alt="Delete" src="/resources/images/icons/trash.png">
                            </button>
                        </span>
                    </details>`;
                }
            }
            insert += `<button onclick="addNote('${group}', '${color}')">Add Note</button>`;
            noteDiv.innerHTML = insert;
            loadNotes.style.display = "none";
            checkForEmojiClasses();
            checkForMdPreviews();
        }).catch( (err) => {
            console.log(err)
        })
    }).catch( (err) => {
        console.log(err)
    })
}

function deleteNote(title, group, color) {
    fetch("notes/deletenote", createHeader({"title": title,
        "group": group})).then( () => {
        getNotes(group, color);
    }).catch( (err) => {
        console.log(err);
    });
}

function addNote(group, color) {
    let title = "New Note -" + Math.floor(Math.random()*1000) + "-";

    console.log(group);

    fetch("notes/addnote", createHeader({
        "title": title,
        "group": group,
        "text": "Add Content here...",
        "create_date": Date.now()
    })).then( () => {
        getNotes(group, color);
    }).catch( (err) => {
       console.log(err);
    });
}

function updateNote(title, group, notepos, color) {
    let note = document.getElementsByTagName("details")[notepos];
    let new_title = note.children[0].children[0].value;
    let new_text = note.children[1].value;

    fetch("notes/updatenote", createHeader({"title": title,
        "group": group,
        "new_title": new_title,
        "new_text": new_text})).then( () => {
            getNotes(group, color);
    }).catch( (err) => {
       console.log(err);
    });
}

function getNoteGroups() {
    getNoteDocElements();
    loadGroups.style.display = "block";

    fetch("notes/getgroups", createHeader({})).then( (res) => {
        res.json().then( (json) => {
            let insert = "";

            for (let i in json) {
                insert += `<button style="background-color: ${json[i]["color"]};" 
onclick="getNotes('${json[i]["title"].replace(/'/g, "\\'")}', '${json[i]["color"]}')">
<input style="background-color: ${json[i]["color"]}; width: 100%; height: 1.2em; text-align: center" class="ngt emoji-support" contenteditable="true" value="${json[i]["title"]}" /><br/>
<input type="color" value="${json[i]["color"]}" />
<div onclick="updateNoteGroup('${json[i]["title"].replace(/'/g, "\\'")}', '${json[i]["color"]}', ${i})">Save</div>
<div onclick="deleteNoteGroup('${json[i]["title"].replace(/'/g, "\\'")}')">Del</div>
</button>`;
            }
            insert += `<br/><button style="align-self: center; padding: 0; font-size: 3rem; line-height: 3rem;" onclick="addNoteGroup();">+</button>`;
            noteGroupDiv.innerHTML = insert;
            loadGroups.style.display = "none";
            checkForEmojiClasses();
        }).catch( (err) => {
            console.log(err)
        })
    }).catch( (err) => {
        console.log(err)
    });
}

function deleteNoteGroup(title) {
    if (confirm("Really delete?") === true) {
        fetch("notes/deletegroup", createHeader({"title": title})).then(() => {
            getNoteGroups();
        }).catch((err) => {
            console.log(err);
        });
    }
}

function addNoteGroup() {
    fetch("notes/addgroup", createHeader({
        "title": "new_group -" + Math.floor(Math.random()*1000) + "-",
        "color": "#999999"
    })).then( () => {
        getNoteGroups();
    }).catch( (err) => {
        console.log(err);
    })
}

function updateNoteGroup(title, color, pos) {
    let new_title = noteGroupDiv.children[pos].children[0].value;
    let new_color = noteGroupDiv.children[pos].children[2].value;

    fetch("notes/updategroup", createHeader({
        "title": title,
        "new_color": new_color,
        "new_title": new_title
    })).then( () => {
        getNoteGroups();
        getNotes(title, new_color);
    }).catch( (err) => {
        console.log(err);
    });
}
