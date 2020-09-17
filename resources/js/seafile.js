function getSeafileSrc() {
    let tm = document.getElementById("seafile");
    let baseUrl = window.location.hostname;
    tm.setAttribute("src", "https://" + baseUrl + ":3666");
}
