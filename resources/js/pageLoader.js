function requestPage(page) {
    const main = document.getElementById("main");

    fetch(page).then( (res) => {
        res.text().then( (text) => {
            main.innerHTML = text;
        });
    }).catch( (err) => {
        console.log("Fetch page failed! Err: " + err);
    })
}