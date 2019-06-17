function createHeader(data, content_type = "application/json") {
    return {
        mode: "same-origin",
        credentials: "same-origin",
        headers: {
            "content-type":content_type
        },
        body: JSON.stringify(data),
        method:"POST"
    };
}

function resetStatus(time = 2000) {
    setTimeout(() => {
        document.getElementById("status").innerHTML = "";
    }, time)
}
