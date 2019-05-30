"use strict";

function requestPage(page) {
    const main = document.getElementById("main");

    if (document.cookie.indexOf('raspiControl_login') < 0) {
        window.location.reload();
        return;
    }


    fetch(page).then( (res) => {
        res.text().then( (text) => {
            main.innerHTML = text;
        });
    }).catch( (err) => {
        console.log("Fetch page failed! Err: " + err);
    })
}

function requestScript(scriptPath) {
    let scripts = document.getElementsByTagName('script');

    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src === (window.location.href + scriptPath.substr(1)) )
            return;
    }

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptPath;
    head.appendChild(script);
}

function logout() {
    document.cookie = "raspiControl_login=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    window.location.reload(true);
}