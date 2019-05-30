document.getElementById("password").addEventListener("keyup", (evt) => {
    if (evt.keyCode === 13) {
        requestRegister();
    }
});

document.getElementById("username").addEventListener("keyup", (evt) => {
    if (evt.keyCode === 13) {
        requestRegister();
    }
});

document.getElementById("password2").addEventListener("keyup", (evt) => {
    if (evt.keyCode === 13) {
        requestRegister();
    }
});

function requestRegister() {
    const status = document.getElementById("status");
    const userInput = document.getElementById("username");
    const user = userInput.value;
    const passInput = document.getElementById("password");
    let pass = passInput.value;
    const passInput2 = document.getElementById("password2");
    let pass2 = passInput2.value;

    if (pass !== pass2) {
        status.innerHTML = "Passwords don't match!";
        passInput.value = "";
        passInput2.value = "";
        return;
    }

    pass = sha3_256(pass);
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

    fetch("tryregister", options).then( (res) => {
        res.text().then( (text) => {
            console.log(text);
            let json = JSON.parse(text);
            if (json.status === "true") {
                window.location.href = "/";
            } else {
                status.innerHTML = json.msg;
                passInput.value = "";
                passInput2.value = "";
                userInput.value = "";
            }
        }).catch( (err) => {
            console.log("Fetch parse error: " + err);
        })
    }).catch( (err) => {
        console.log("Fetch trylogin error: " + err);
    })
}