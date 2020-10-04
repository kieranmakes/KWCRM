

//toggles the type in the password text boxes between password and text
// activated by the check box onClick()
function showPassword() {

    let oldPasswordField = document.querySelector("#old-password");
    let newPasswordField = document.querySelector("#new-password");
    let confirmPasswordField = document.querySelector("#confirm-password");

    if(oldPasswordField.type === "password" && newPasswordField.type === "password" && confirmPasswordField.type === "password"){
        oldPasswordField.type = "text";
        newPasswordField.type = "text";
        confirmPasswordField.type = "text";
    }
    else {
        oldPasswordField.type = "password";
        newPasswordField.type = "password";
        confirmPasswordField.type = "password";
    }
}
