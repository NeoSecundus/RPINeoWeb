function getSeafileSrc() {
    let tm = document.getElementById("seafile");
    let baseUrl = window.location.hostname;
    tm.setAttribute("src", "http://" + baseUrl + ":3666");
}