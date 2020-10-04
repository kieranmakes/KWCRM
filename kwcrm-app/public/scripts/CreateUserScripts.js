

//toggles the type in the password text boxes between password and text
function showPassword() {
    console.log("running show password method");
    let passwordField = document.querySelector("#password");
    let confirmPasswordField = document.querySelector("#confirm-password");

    if(passwordField.type === "password" && confirmPasswordField.type === "password"){
        passwordField.type = "text";
        confirmPasswordField.type = "text";
    }
    else {
        passwordField.type = "password";
        confirmPasswordField.type = "password";
    }
}
