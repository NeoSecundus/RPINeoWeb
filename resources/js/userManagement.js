function getUserList() {
    const uList = document.getElementById("userList");
    uList.innerHTML = "";
    document.getElementById("load").style.display = "block";
    const status = document.getElementById("status");

    fetch("getusers").then( (res) => {
        res.text().then( (text) => {
            const json = JSON.parse(text);

            if (json["status"] != null) {
                status.innerHTML = json["msg"];
                return;
            }

            for (let user in json) {
                uList.innerHTML += `<li>User: ${user}
                    <button onclick="document.getElementById('user').value = '${user}'" style="height: 1.1rem; position: relative; top: 0.1rem; padding: 0.05rem 0.2rem">
                        <img src="/resources/images/icons/edit.png" alt="Edit" style="height: 1rem"/>
                    </button> <br/>
                    Privileges: ${json[user]["privileges"]}
                </li>`;
            }
            document.getElementById("load").style.display = "none";
        }).catch( (err) => {
            console.log("Error while parsing user-list: " + err)
        })
    }).catch( (err) => {
        console.log("Error while fetching User-List: " + err)
    });
}

function changeUser(action, data) {
    const status = document.getElementById("status");
    status.innerHTML = "";

    const options = createHeader(data);

    fetch(action, options).then( (data) => {
        data.text().then( (text) => {
            const json = JSON.parse(text);

            if (json.status === "true") {
                getUserList();
                status.innerHTML = "Operation successful!";
            } else {
                status.innerHTML = json.msg;
            }
        }).catch( (err) => {
            console.log("Could not parse JSON! " + err)
        })
    }).catch( (err) => {
        console.log("Could not fetch! " + err);
    });
    resetStatus();
}

function changePrivileges() {
    const user = document.getElementById("user").value;
    if (!confirm("Really change privileges of user: " + user + "?"))
        return;

    const privilege = document.getElementById("privileges").value;

    changeUser("changeprivileges", {"user":user, "privileges":privilege});
}

function resetPassword() {
    const user = document.getElementById("user").value;
    if (!confirm("Really reset password of user: " + user + "?"))
        return;

    const privilege = document.getElementById("privileges").value;

    changeUser("resetpassword", {"user":user, "privileges":privilege});
}

function removeUser() {
    const user = document.getElementById("user").value;
    if (!confirm("Really remove user: " + user + "?"))
        return;

    changeUser("removeuser", {"user":user});
}

function addUser() {
    const user = document.getElementById("user").value;
    if (!confirm("Really add user: " + user + "?"))
        return;

    const privilege = document.getElementById("privileges").value;

    changeUser("adduser", {"user":user, "privileges":privilege});
}
