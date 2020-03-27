let noteDiv;
let noteGroupDiv;

function getNoteDocElements() {
    noteDiv = document.getElementById("notes");
    noteGroupDiv = document.getElementById("notegroups");
}

function getNotes(group, color) {
    fetch("notes/getnotes", createHeader({"group": group})).then( (res) => {
        res.json().then( (json) => {
            let insert = "";

            if (json[0]) {
                for (let i in json) {
                    insert += `
                    <details style="background-color: ${color}">
                        <summary><span class="emoji-support" contenteditable="true" style="width: 100%;">${json[i]["title"]}</span></summary>
                        <span contenteditable="true" class="emoji-support" style="width: 100%;">${json[i]["text"]}</span><br/>
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
            checkForEmojiClasses();
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
    let new_title = note.children[0].children[0].innerHTML;
    let new_text = note.children[1].innerHTML;

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

    fetch("notes/getgroups", createHeader({})).then( (res) => {
        res.json().then( (json) => {
            let insert = "";

            for (let i in json) {
                insert += `<button style="background-color: ${json[i]["color"]};" 
onclick="getNotes('${json[i]["title"].replace(/'/g, "\\'")}', '${json[i]["color"]}')">
<div class="ngt emoji-support" contenteditable="true">${json[i]["title"]}</div><br/>
<input type="color" value="${json[i]["color"]}" />
<div onclick="updateNoteGroup('${json[i]["title"].replace(/'/g, "\\'")}', '${json[i]["color"]}', ${i})">Save</div>
<div onclick="deleteNoteGroup('${json[i]["title"].replace(/'/g, "\\'")}')">Del</div>
</button>`;
            }
            insert += `<br/><button style="align-self: center; padding: 0; font-size: 3rem; line-height: 3rem;" onclick="addNoteGroup();">+</button>`;
            noteGroupDiv.innerHTML = insert;
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
        "color": "#ffffff"
    })).then( () => {
        getNoteGroups();
    }).catch( (err) => {
        console.log(err);
    })
}

function updateNoteGroup(title, color, pos) {
    let new_title = noteGroupDiv.children[pos].children[0].innerHTML;
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