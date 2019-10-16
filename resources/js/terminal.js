function getTerminalSrc() {
    let tm = document.getElementById("terminal");
    let baseUrl = window.location.hostname;
    console.log(baseUrl);
    tm.setAttribute("src", "http://" + baseUrl + ":3636");

    setTimeout( () => {
        tm.style.height = '80vh';
    }, 5000);
}
