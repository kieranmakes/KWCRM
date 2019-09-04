// function that prevents the enter/ return key from being used
function returnKeyBlocker(e) {
    // sets e to be equal to either the event passed as argument or the window.event object for IE support
    e = e || window.event;
    // gets the key of e but if that is deprecated or isnt supported by the browser then then charCode is used
    let keyCode = e.keyCode || e.charCode;
    return keyCode !== 13;
}
