window.onload = function () {
    var flash = document.querySelector(".flash-message")
    window.setTimeout(function () {
        flash.classList.add("disapper")
    }, 5000);
}