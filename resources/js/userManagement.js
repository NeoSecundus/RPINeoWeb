function getUserList() {
    const uList = document.getElementById("userList");
    document.getElementById("load").style.display = "block";

    fetch("getUsers").then( (res) => {
        res.text().then( (text) => {
            uList.innerHTML = "";
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



document.getElementsByTagName("button")[1].addEventListener("click", () => {
    setTimeout( () => {
        getUserList();
    }, 1000);
});
getUserList();