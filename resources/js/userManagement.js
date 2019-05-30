function getUserList() {
    const uList = document.getElementById("userList");
    uList.innerHTML = "";
    document.getElementById("load").style.display = "block";

    fetch("getusers").then( (res) => {
        res.text().then( (text) => {
            const json = JSON.parse(text);

            for (let user in json) {
                uList.innerHTML += `<li>User: ${user}</li>`;
            }
            document.getElementById("load").style.display = "none";
        }).catch( (err) => {
            console.log("Error while parsing user-list: " + err)
        })
    }).catch( (err) => {
        console.log("Error while fetching User-List: " + err)
    });
}

function changeUser(action) {
    const status = document.getElementById("status");
    status.innerHTML = "";
    const user = document.getElementById("user").value;

    const options = {
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify({"user": user}),
        method:"POST"
    };

    fetch(action, options).then( (data) => {
        data.text().then( (text) => {
            const json = JSON.parse(text);

            if (json.status === "true") {
                getUserList();
            } else {
                status.innerHTML = json.msg;
            }
        }).catch( (err) => {
            console.log("Could not parse JSON! " + err)
        })
    }).catch( (err) => {
        console.log("Could not fetch! " + err);
    })
}

function removeUser() {
    changeUser("removeuser");
}

function addUser() {
    changeUser("adduser");
}

document.getElementsByTagName("button")[1].addEventListener("click", () => {
    setTimeout( () => {
        getUserList();
    }, 1000);
});
getUserList();