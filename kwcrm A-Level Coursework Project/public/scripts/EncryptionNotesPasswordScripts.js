

//toggles the type in the password text boxes between password and text
// activated by the check box onClick()
function showPassword() {

    let PasswordField = document.querySelector("#password");
    let confirmPasswordField = document.querySelector("#confirmPassword");

    if(PasswordField.type === "password" && confirmPasswordField.type === "password"){
        PasswordField.type = "text";
        confirmPasswordField.type = "text";
    }
    else {
        PasswordField.type = "password";
        confirmPasswordField.type = "password";
    }
}
