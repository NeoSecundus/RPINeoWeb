let noteDiv = document.getElementById("notes");
let noteGroupDiv = document.getElementById("notegroups");

function getNotes() {

}

function deleteNote() {

}

function addNote() {

}

function updateNote() {

}

function getGroups() {
    fetch("notes/getgroups", createHeader({})).then( (res) => {
        res.json().then( (json) => {
            let insert = "";

            for (let i in json) {
                insert += `<button style="background-color: ${json[i]["color"]};">
${json[i]["title"]}
</button>`;
            }
            noteGroupDiv.innerHTML = insert;
        }).catch( (err) => {
            console.log(err)
        })
    }).catch( (err) => {
        console.log(err)
    })
}

function deleteGroup() {

}

function addGroup() {

}

function updateNote() {

}

getGroups();