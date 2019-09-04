

//toggles the type in the password text boxes between password and text
function showPassword() {
    console.log("running show password method");
    let passwordField = document.querySelector("#password");


    if(passwordField.type === "password"){
        passwordField.type = "text";
    }
    else {
        passwordField.type = "password";
    }
}
