document.getElementById("password").addEventListener("keyup", (evt) => {
    if (evt.keyCode === 13) {
        requestLogin();
    }
});

document.getElementById("username").addEventListener("keyup", (evt) => {
    if (evt.keyCode === 13) {
        requestLogin();
    }
});

function requestLogin() {
    const userInput = document.getElementById("username");
    const user = userInput.value;
    const passInput = document.getElementById("password");
    let pass = passInput.value;
    pass = sha3_256(pass);
    const status = document.getElementById("status");

    const data = {
        user: user,
        pass: pass
    };

    const options = {
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(data),
        method:"POST"
    };

    fetch("trylogin", options).then( (res) => {
        res.text().then( (text) => {
            console.log(text);
            let json = JSON.parse(text);
            if (json.status === "true") {
                window.location.reload(true);
            } else {
                status.innerHTML = "Wrong username or password!";
                passInput.value = "";
                userInput.value = "";
            }
        }).catch( (err) => {
            console.log("Fetch parse error: " + err);
        })
    }).catch( (err) => {
        console.log("Fetch trylogin error: " + err);
    })
}