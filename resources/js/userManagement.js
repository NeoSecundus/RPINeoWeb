function getUserList() {
    const uList = document.getElementById("userList");

    fetch("getUsers").then( (res) => {
        res.text().then( (text) => {
            uList.innerHTML = "";
            const json = JSON.parse(text);

            for (let user in json) {
                uList.innerHTML += `<li>User: ${user}</li>`;
            }
        }).catch( (err) => {
            console.log("Error while parsing user-list: " + err)
        })
    }).catch( (err) => {
        console.log("Error while fetching User-List: " + err)
    });
}

document.getElementsByTagName("button")[1].addEventListener("click", () => {
    setTimeout( () => {
        getUserList();
    }, 1000);
});

setTimeout( () => {
    getUserList();
}, 1000);